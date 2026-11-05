import { Readable } from "node:stream";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const REQUIRED_TEXT_FIELDS = [
  "fullName",
  "school",
  "email",
  "whatsapp",
  "tiktok",
  "tiktokFollowers",
  "instagram",
  "instagramFollowers",
  "motivation",
] as const;

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_FILE_COUNT = 10;
const DRIVE_UPLOAD_CONCURRENCY = Number(process.env.DRIVE_UPLOAD_CONCURRENCY ?? 3);

type RequiredTextField = (typeof REQUIRED_TEXT_FIELDS)[number];
type RegistrationPayload = Record<RequiredTextField, string>;
type DriveClient = ReturnType<typeof google.drive>;
type SheetsClient = ReturnType<typeof google.sheets>;
const SUBMITTED_AT_TIME_ZONE = "Asia/Jakarta";

function getSubmittedAtUtc7(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SUBMITTED_AT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((accumulator, part) => {
      if (part.type !== "literal") {
        accumulator[part.type] = part.value;
      }
      return accumulator;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} UTC+7`;
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getGoogleClients() {
  const clientId = getEnv("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = getEnv("GOOGLE_OAUTH_CLIENT_SECRET");
  const refreshToken = getEnv("GOOGLE_OAUTH_REFRESH_TOKEN");

  const auth = new google.auth.OAuth2({
    clientId,
    clientSecret,
  });
  auth.setCredentials({
    refresh_token: refreshToken,
  });

  return {
    drive: google.drive({ version: "v3", auth }),
    sheets: google.sheets({ version: "v4", auth }),
  };
}

function readText(formData: FormData, field: RequiredTextField): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function validateTextPayload(payload: RegistrationPayload): string | null {
  for (const field of REQUIRED_TEXT_FIELDS) {
    if (!payload[field]) {
      return `Field '${field}' is required.`;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return "Email format is invalid.";
  }

  for (const field of ["tiktokFollowers", "instagramFollowers"] as const) {
    const followerCount = Number(payload[field]);
    if (!Number.isSafeInteger(followerCount) || followerCount < 0) {
      return `Field '${field}' must be a non-negative whole number.`;
    }
  }

  return null;
}

function getProofFiles(formData: FormData): File[] {
  const entries = formData.getAll("followProof");
  return entries.filter(
    (entry): entry is File => entry instanceof File && entry.size > 0,
  );
}

function validateProofFiles(files: File[]): string | null {
  if (files.length === 0) {
    return "At least one proof file is required.";
  }

  if (files.length > MAX_FILE_COUNT) {
    return `Maximum ${MAX_FILE_COUNT} proof files are allowed.`;
  }

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return `File '${file.name}' must be an image.`;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File '${file.name}' exceeds 8MB size limit.`;
    }
  }

  return null;
}

function createLimiter(concurrency: number) {
  let activeCount = 0;
  const queue: Array<() => void> = [];

  const next = () => {
    activeCount = Math.max(0, activeCount - 1);
    if (queue.length > 0) {
      const run = queue.shift();
      run?.();
    }
  };

  return async <T>(task: () => Promise<T>) => {
    if (activeCount >= concurrency) {
      await new Promise<void>((resolve) => {
        queue.push(resolve);
      });
    }

    activeCount += 1;
    try {
      return await task();
    } finally {
      next();
    }
  };
}

async function uploadSingleFile(
  drive: DriveClient,
  file: File,
  folderId: string,
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const created = await drive.files.create({
    requestBody: {
      name: `proof-${Date.now()}-${file.name}`,
      parents: [folderId],
      mimeType: file.type || undefined,
    },
    media: {
      mimeType: file.type || "application/octet-stream",
      body: Readable.from(buffer),
    },
    fields: "id, webViewLink, webContentLink",
    supportsAllDrives: true,
  });

  const fileId = created.data.id;
  if (!fileId) {
    throw new Error("Failed to upload proof file to Google Drive.");
  }

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
    supportsAllDrives: true,
  });

  return (
    created.data.webViewLink ??
    created.data.webContentLink ??
    `https://drive.google.com/file/d/${fileId}/view`
  );
}

async function uploadFilesToDrive(
  drive: DriveClient,
  files: File[],
  folderId: string,
) {
  const limiter = createLimiter(Number.isFinite(DRIVE_UPLOAD_CONCURRENCY) && DRIVE_UPLOAD_CONCURRENCY > 0
    ? DRIVE_UPLOAD_CONCURRENCY
    : 3);

  const results = await Promise.all(
    files.map((file) => limiter(() => uploadSingleFile(drive, file, folderId))),
  );

  return results;
}

let cachedSheetName: string | null = null;

// Match the configured tab name against the spreadsheet's actual tabs so a
// mismatched env value (e.g. "Sheet1" vs "Sheet 1") doesn't break submissions.
async function resolveSheetName(
  sheets: SheetsClient,
  spreadsheetId: string,
): Promise<string> {
  if (cachedSheetName) return cachedSheetName;

  const configured = (process.env.GOOGLE_SHEETS_SHEET_NAME || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");

  const { data } = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });
  const titles = (data.sheets ?? [])
    .map((sheet) => sheet.properties?.title)
    .filter((title): title is string => Boolean(title));

  if (titles.length === 0) {
    throw new Error("Spreadsheet has no tabs");
  }

  const normalize = (value: string) => value.replace(/\s+/g, "").toLowerCase();
  const match =
    titles.find((title) => title === configured) ??
    titles.find((title) => normalize(title) === normalize(configured));

  if (!match && configured) {
    console.warn(
      `[register] Sheet tab "${configured}" not found (tabs: ${titles.join(", ")}); using "${titles[0]}"`,
    );
  }

  const resolved: string = match ?? titles[0];
  cachedSheetName = resolved;
  return resolved;
}

async function appendToSheet(
  sheets: SheetsClient,
  payload: RegistrationPayload,
  proofUrls: string[],
  submittedAt: string,
) {
  const spreadsheetId = getEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const sheetName = await resolveSheetName(sheets, spreadsheetId);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${sheetName.replace(/'/g, "''")}'!A:K`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          submittedAt,
          payload.fullName,
          payload.school,
          payload.email,
          payload.whatsapp,
          payload.tiktok,
          payload.tiktokFollowers,
          payload.instagram,
          payload.instagramFollowers,
          payload.motivation,
          proofUrls.join("\n"),
        ],
      ],
    },
  });
}

const PMB_TRACKING_URL =
  process.env.PMB_TRACKING_URL || "https://pmb.stekom.ac.id/api/tracking/submit-direct";
const PMB_TIMEOUT_MS = 8000;

// Mirrors the registration to the PMB tracking API. Best effort: the applicant's
// submission is already saved to Sheets, so a PMB failure is logged, not surfaced.
async function sendToPmbTracking(
  request: Request,
  payload: RegistrationPayload,
  proofUrls: string[],
  submittedAt: string,
) {
  const origin = new URL(request.url).origin;
  const sourcePage = (request.headers.get("referer") || `${origin}/register`).slice(0, 255);
  const phone = payload.whatsapp.replace(/[^\d+]/g, "").slice(0, 20);

  try {
    const response = await fetch(PMB_TRACKING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        source_page: sourcePage,
        nama: payload.fullName.slice(0, 255),
        email: payload.email.slice(0, 255),
        phone,
        data: {
          program: "Duta Teladan Universitas STEKOM - Topstar",
          submitted_at: submittedAt,
          full_name: payload.fullName,
          school: payload.school,
          email: payload.email,
          whatsapp: payload.whatsapp,
          tiktok: payload.tiktok,
          tiktok_followers: Number(payload.tiktokFollowers),
          instagram: payload.instagram,
          instagram_followers: Number(payload.instagramFollowers),
          motivation: payload.motivation,
          follow_proof_urls: proofUrls,
        },
      }),
      signal: AbortSignal.timeout(PMB_TIMEOUT_MS),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[register] PMB tracking responded ${response.status}: ${body.slice(0, 500)}`);
    }
  } catch (error) {
    console.error(`[register] PMB tracking failed: ${toMessage(error)}`);
  }
}

function toMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { error?: { message?: string } } } }).response;
    const apiMessage = response?.data?.error?.message;
    if (apiMessage) {
      return apiMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unexpected server error.";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload = Object.fromEntries(
      REQUIRED_TEXT_FIELDS.map((field) => [field, readText(formData, field)]),
    ) as RegistrationPayload;
    const proofFiles = getProofFiles(formData);

    const textError = validateTextPayload(payload);
    if (textError) {
      return NextResponse.json({ error: textError }, { status: 400 });
    }

    const fileError = validateProofFiles(proofFiles);
    if (fileError) {
      return NextResponse.json({ error: fileError }, { status: 400 });
    }

    const { drive, sheets } = getGoogleClients();
    const driveFolderId = getEnv("GOOGLE_DRIVE_FOLDER_ID");

    let proofUrls: string[];
    try {
      proofUrls = await uploadFilesToDrive(drive, proofFiles, driveFolderId);
    } catch (error) {
      throw new Error(`Drive upload failed: ${toMessage(error)}`);
    }

    const submittedAt = getSubmittedAtUtc7();

    try {
      await appendToSheet(sheets, payload, proofUrls, submittedAt);
    } catch (error) {
      throw new Error(`Sheets append failed: ${toMessage(error)}`);
    }

    await sendToPmbTracking(request, payload, proofUrls, submittedAt);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: toMessage(error) },
      { status: 500 },
    );
  }
}
