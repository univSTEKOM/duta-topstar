"use client";

import { useEffect, useState } from "react";

import { t } from "@/data/program-content";
import type { Locale, ProgramContent } from "@/types/program";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowIcon, Icon } from "@/components/brand/icons";
import { Pita } from "@/components/brand/mark";
import { onOpenRegistration, setRegistrationReady } from "@/lib/registration";

interface RegistrationFormProps {
  locale: Locale;
  formContent: ProgramContent["form"];
}

export function RegistrationForm({ locale, formContent }: RegistrationFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [proofError, setProofError] = useState<string | null>(null);

  const urgencyTitle = locale === "id" ? "Batch 2 dibuka" : "Batch 2 is now open";
  const urgencyDescription =
    locale === "id"
      ? "Tersisa 30 orang lagi. Prioritas untuk pendaftar tercepat."
      : "Only 30 spots left. Priority goes to the fastest applicants.";
  const urgencyBadge =
    locale === "id" ? "Rekrutmen aktif" : "Active recruitment";
  const remainingLabel = locale === "id" ? "Slot tersisa" : "spots left";
  const progressLabel =
    locale === "id" ? "Kuota batch hampir penuh" : "Batch quota is nearly full";
  const responseHint =
    locale === "id"
      ? "Tim akan menghubungi pendaftar terpilih via WhatsApp."
      : "The team will contact selected applicants via WhatsApp.";
  const registerLabel = t(formContent.submit, locale);
  const formTitle =
    locale === "id"
      ? "Formulir pendaftaran"
      : "Registration form";
  const formSubtitle =
    locale === "id"
      ? "Pelatihan content creator · Duta Teladan Universitas STEKOM"
      : "Content creator training · Duta Teladan Universitas STEKOM";
  const submitLabel = locale === "id" ? "Kirim pendaftaran" : "Submit registration";
  const submitSuccess =
    locale === "id"
      ? "Form berhasil dikirim. Tim kami akan segera menghubungi kamu."
      : "Form submitted successfully. Our team will contact you soon.";
  const submitErrorFallback =
    locale === "id"
      ? "Terjadi kendala saat mengirim form. Coba lagi."
      : "There was a problem submitting the form. Please try again.";
  const submittingLabel =
    locale === "id" ? "Mengirim…" : "Submitting…";
  const formHint =
    locale === "id"
      ? "Pastikan data yang kamu isi valid dan dapat dihubungi."
      : "Make sure all information is valid and reachable.";
  const followProofHint =
    locale === "id"
      ? "Unggah screenshot bukti bahwa kamu sudah mengikuti 4 akun berikut: Universitas STEKOM (TikTok & Instagram) dan TopLoker.com (TikTok & Instagram)."
      : "Upload screenshots proving you follow 4 accounts: Universitas STEKOM (TikTok & Instagram) and TopLoker.com (TikTok & Instagram).";
  const followProofMultiHint =
    locale === "id"
      ? "Bisa upload beberapa file sekaligus. Jika salah upload, hapus file yang tidak sesuai."
      : "You can upload multiple files at once. If wrong, remove the incorrect file.";
  const followProofRequiredError =
    locale === "id"
      ? "Upload minimal 1 file bukti follow."
      : "Upload at least one follow proof file.";
  const followAccounts = [
    {
      name: "Universitas STEKOM",
      tiktok: "https://tiktok.com/@stekomuniversity",
      tiktokHandle: "@stekomuniversity",
      instagram: "https://instagram.com/universitasstekom",
      instagramHandle: "@universitasstekom",
    },
    {
      name: "TopLoker.com",
      tiktok: "https://tiktok.com/@toploker.com",
      tiktokHandle: "@toploker.com",
      instagram: "https://instagram.com/toplokercom",
      instagramHandle: "@toplokercom",
    },
  ];
  const selectedFilesLabel =
    locale === "id" ? "File terpilih" : "Selected files";
  const removeAllFilesLabel =
    locale === "id" ? "Hapus semua" : "Remove all";
  const removeSingleFileLabel =
    locale === "id" ? "Hapus file" : "Remove file";
  const motivationHintTitle =
    locale === "id" ? "Ceritakan secara singkat:" : "Briefly explain:";
  const motivationHints =
    locale === "id"
      ? [
          "alasan ingin belajar content creator",
          "tujuan mengikuti pelatihan",
          "manfaat yang ingin kamu dapatkan dari pelatihan ini",
        ]
      : [
          "your reason for learning content creation",
          "your goal in joining this training",
          "the benefits you expect from this program",
        ];
  const basicFields = [
    {
      id: "fullName",
      number: "1",
      label: locale === "id" ? "Nama lengkap" : "Full name",
      helper:
        locale === "id"
          ? "Tuliskan nama lengkap sesuai identitas."
          : "Write your full legal name.",
      placeholder:
        locale === "id"
          ? "Contoh: Budi Santoso"
          : "Example: John Doe",
      type: "text",
    },
    {
      id: "school",
      number: "2",
      label: locale === "id" ? "Asal sekolah / instansi" : "School / institution",
      helper:
        locale === "id"
          ? "Contoh: SMKN 1 Surabaya."
          : "Example: Vocational High School 1 Surabaya.",
      placeholder:
        locale === "id"
          ? "Masukkan asal sekolah atau instansi"
          : "Enter your school or institution",
      type: "text",
    },
    {
      id: "email",
      number: "3",
      label: locale === "id" ? "Email aktif" : "Active email",
      helper:
        locale === "id"
          ? "Gunakan email aktif untuk menerima informasi terkait pelatihan."
          : "Use an active email for training information updates.",
      placeholder:
        locale === "id"
          ? "nama@email.com"
          : "name@email.com",
      type: "email",
    },
    {
      id: "whatsapp",
      number: "4",
      label: locale === "id" ? "Nomor WhatsApp" : "WhatsApp number",
      helper:
        locale === "id"
          ? "Masukkan nomor WhatsApp aktif yang dapat dihubungi."
          : "Enter an active WhatsApp number that can be contacted.",
      placeholder:
        locale === "id"
          ? "Contoh: 08xxxxxxxxxx"
          : "Example: 08xxxxxxxxxx",
      type: "tel",
    },
    {
      id: "tiktok",
      number: "5",
      label: locale === "id" ? "Akun TikTok" : "TikTok account",
      helper:
        locale === "id"
          ? "Tuliskan username atau link akun TikTok kamu."
          : "Write your TikTok username or account link.",
      placeholder:
        locale === "id"
          ? "@username / https://tiktok.com/..."
          : "@username / https://tiktok.com/...",
      type: "text",
    },
    {
      id: "tiktokFollowers",
      number: "6",
      label: locale === "id" ? "Jumlah followers TikTok" : "TikTok follower count",
      helper:
        locale === "id"
          ? "Masukkan jumlah followers pada akun TikTok kamu."
          : "Enter the number of followers on your TikTok account.",
      placeholder: locale === "id" ? "Contoh: 1500" : "Example: 1500",
      type: "number",
    },
    {
      id: "instagram",
      number: "7",
      label: locale === "id" ? "Akun Instagram" : "Instagram account",
      helper:
        locale === "id"
          ? "Tuliskan username atau link akun Instagram kamu."
          : "Write your Instagram username or account link.",
      placeholder:
        locale === "id"
          ? "@username / https://instagram.com/..."
          : "@username / https://instagram.com/...",
      type: "text",
    },
    {
      id: "instagramFollowers",
      number: "8",
      label: locale === "id" ? "Jumlah followers Instagram" : "Instagram follower count",
      helper:
        locale === "id"
          ? "Masukkan jumlah followers pada akun Instagram kamu."
          : "Enter the number of followers on your Instagram account.",
      placeholder: locale === "id" ? "Contoh: 1200" : "Example: 1200",
      type: "number",
    },
  ] as const;

  // Every "Daftar" button on the page opens this dialog directly once the form is mounted.
  useEffect(() => {
    setRegistrationReady(true);
    const unsubscribe = onOpenRegistration(() => setIsDialogOpen(true));
    return () => {
      setRegistrationReady(false);
      unsubscribe();
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsSubmitted(false);
      setIsSubmitting(false);
      setSubmitError(null);
      setProofFiles([]);
      setProofError(null);
    }
  };

  const handleProofChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);
    if (incomingFiles.length === 0) {
      return;
    }

    setProofFiles((currentFiles) => {
      const fileMap = new Map(
        currentFiles.map((file) => [
          `${file.name}-${file.size}-${file.lastModified}`,
          file,
        ]),
      );

      incomingFiles.forEach((file) => {
        fileMap.set(`${file.name}-${file.size}-${file.lastModified}`, file);
      });

      return Array.from(fileMap.values());
    });

    setProofError(null);
    setSubmitError(null);
    setIsSubmitted(false);
    event.target.value = "";
  };

  const removeProofFile = (fileToRemove: File) => {
    setProofFiles((currentFiles) =>
      currentFiles.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          ),
      ),
    );
    setIsSubmitted(false);
  };

  const clearProofFiles = () => {
    setProofFiles([]);
    setProofError(null);
    setSubmitError(null);
    setIsSubmitted(false);
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    }
    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    }
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (proofFiles.length === 0) {
      setProofError(followProofRequiredError);
      setIsSubmitted(false);
      return;
    }

    setProofError(null);
    setSubmitError(null);
    setIsSubmitting(true);
    setIsSubmitted(false);

    try {
      const form = event.currentTarget;
      const payload = new FormData(form);

      payload.delete("followProof");
      proofFiles.forEach((file) => {
        payload.append("followProof", file, file.name);
      });

      const response = await fetch("/api/register", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string; success?: boolean }
        | null;

      if (!response.ok) {
        throw new Error(result?.error || submitErrorFallback);
      }

      form.reset();
      setProofFiles([]);
      setIsSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : submitErrorFallback;
      setSubmitError(message);
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lp-register">
      <div className="lp-register__tags">
        <span className="ts-tag ts-tag--biru">{urgencyTitle}</span>
        <span className="ts-tag">
          <span className="ts-dot" />
          {urgencyBadge}
        </span>
      </div>
      <h3 className="ts-h2">{t(formContent.title, locale)}</h3>

      <div className="lp-meter">
        <div className="lp-meter__row">
          <span>{urgencyDescription}</span>
          <span className="shrink-0 text-right">
            <b>30</b> {remainingLabel.toLowerCase()}
          </span>
        </div>
        <div
          className="lp-meter__bar"
          role="meter"
          aria-label={progressLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={70}
        >
          <span style={{ width: "70%" }} />
        </div>
        <span className="ts-caption">{progressLabel} · 70%</span>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button type="button" className="ts-btn ts-btn--accent ts-btn--lg">
            {registerLabel}
            <ArrowIcon />
          </button>
        </DialogTrigger>

        <DialogContent className="lp-dialog left-0 top-0 h-[100dvh] max-h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 p-0 shadow-lg sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[92vh] sm:w-[calc(100%-1.5rem)] sm:max-w-4xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[var(--radius-xl)] sm:border">
          <div className="h-[100dvh] overflow-y-auto sm:h-auto sm:max-h-[92vh]">
            <div className="lp-dialog__head">
              <p className="ts-overline">
                <Pita />
                {formSubtitle}
              </p>
              <DialogTitle className="lp-dialog__title text-[28px] leading-[1.15] font-black max-sm:text-2xl">{formTitle}</DialogTitle>
              <DialogDescription className="ts-small mt-1">{formHint}</DialogDescription>

              <div className="lp-dialog__facts">
                <div>
                  <b>10</b>
                  <span className="ts-caption">{locale === "id" ? "Isian wajib" : "Required fields"}</span>
                </div>
                <div>
                  <b>Batch 2</b>
                  <span className="ts-caption">{locale === "id" ? "Gelombang aktif" : "Active wave"}</span>
                </div>
                <div>
                  <b>30</b>
                  <span className="ts-caption">{remainingLabel}</span>
                </div>
              </div>
            </div>

            <form className="lp-form" onSubmit={handleSubmit} noValidate>
              <div className="lp-form__grid">
                {basicFields.map((field) => (
                  <div key={field.id}>
                    <label className="ts-label" htmlFor={field.id}>
                      <span className="lp-form__num">{field.number}</span>
                      {field.label}
                    </label>
                    <p className="ts-help" id={`${field.id}-help`}>
                      {field.helper}
                    </p>
                    <input
                      className="ts-field"
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      min={field.type === "number" ? 0 : undefined}
                      step={field.type === "number" ? 1 : undefined}
                      aria-describedby={`${field.id}-help`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="lp-form__group">
                <label className="ts-label" htmlFor="followProof">
                  <span className="lp-form__num">9</span>
                  {locale === "id"
                    ? "Bukti follow Instagram & TikTok Universitas STEKOM + TopLoker.com"
                    : "Proof of following Universitas STEKOM + TopLoker.com on Instagram & TikTok"}
                </label>
                <p className="ts-help">{followProofHint}</p>

                <div className="lp-form__accounts">
                  {followAccounts.map((account) => (
                    <div key={account.name} className="lp-account">
                      <div className="lp-account__head">
                        <p className="ts-profile__name">{account.name}</p>
                        <span className="ts-tag ts-tag--kuning">
                          {locale === "id" ? "Wajib follow · 2 akun" : "Must follow · 2 accounts"}
                        </span>
                      </div>
                      <div className="lp-account__row">
                        <span>TikTok</span>
                        <b>{account.tiktokHandle}</b>
                      </div>
                      <div className="lp-account__row">
                        <span>Instagram</span>
                        <b>{account.instagramHandle}</b>
                      </div>
                      <div className="lp-account__links">
                        <a className="ts-btn ts-btn--secondary ts-btn--sm" href={account.instagram} target="_blank" rel="noreferrer">
                          Instagram
                        </a>
                        <a className="ts-btn ts-btn--secondary ts-btn--sm" href={account.tiktok} target="_blank" rel="noreferrer">
                          TikTok
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <label className="lp-drop" aria-invalid={proofError ? true : undefined}>
                  <Icon name="kamera" size="lg" />
                  <span className="ts-small">
                    <b className="text-[var(--link)]">{locale === "id" ? "Pilih screenshot" : "Choose screenshots"}</b>
                    {" · "}
                    {followProofMultiHint}
                  </span>
                  <input
                    id="followProof"
                    name="followProof"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProofChange}
                    className="sr-only"
                  />
                </label>

                {proofFiles.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="ts-small">
                        {selectedFilesLabel} ({proofFiles.length})
                      </p>
                      <button type="button" className="ts-btn ts-btn--ghost" onClick={clearProofFiles}>
                        {removeAllFilesLabel}
                      </button>
                    </div>
                    <ul className="lp-files">
                      {proofFiles.map((file) => (
                        <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                          <div>
                            <p>{file.name}</p>
                            <p className="ts-caption">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            type="button"
                            className="lp-icon-btn"
                            onClick={() => removeProofFile(file)}
                            aria-label={`${removeSingleFileLabel}: ${file.name}`}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M6 6l12 12M18 6 6 18" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {proofError && (
                  <p className="lp-notice lp-notice--error mt-3" role="alert">
                    {proofError}
                  </p>
                )}
              </div>

              <div className="lp-form__group">
                <label className="ts-label" htmlFor="motivation">
                  <span className="lp-form__num">10</span>
                  {locale === "id" ? "Motivasi bergabung" : "Why you want to join"}
                </label>
                <p className="ts-help" id="motivation-help">
                  {locale === "id"
                    ? "Apa motivasimu bergabung dalam pelatihan content creator Duta Teladan Universitas STEKOM?"
                    : "What is your motivation to join this content creator training by Duta Teladan Universitas STEKOM?"}
                </p>
                <textarea
                  className="ts-field"
                  id="motivation"
                  name="motivation"
                  rows={6}
                  placeholder={
                    locale === "id"
                      ? "Ceritakan motivasi kamu bergabung dalam pelatihan ini"
                      : "Tell us your motivation to join this training"
                  }
                  aria-describedby="motivation-help"
                  required
                />
                <div className="ts-help">
                  <p className="m-0 font-bold">{motivationHintTitle}</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {motivationHints.map((hint) => (
                      <li key={hint}>{hint}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lp-form__foot">
                {submitError && (
                  <p className="lp-notice lp-notice--error" role="alert">
                    {submitError}
                  </p>
                )}

                {isSubmitted && (
                  <p className="lp-notice lp-notice--ok" role="status">
                    <Icon name="sertifikat" size="md" />
                    {submitSuccess}
                  </p>
                )}

                <div className="lp-form__foot-row">
                  <p className="ts-caption">{responseHint}</p>
                  <button type="submit" className="ts-btn ts-btn--primary" disabled={isSubmitting}>
                    {isSubmitting ? submittingLabel : submitLabel}
                    {!isSubmitting && <ArrowIcon />}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <p className="ts-caption lp-register__hint">
        <Icon name="pesan" size="sm" />
        {responseHint}
      </p>
    </div>
  );
}
