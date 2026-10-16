import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// Topstar uses one family: Nunito. The variable sits on <html> so tokens on :root can read it.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

// Applies a saved light/dark choice before first paint; without one, tokens follow the system.
const themeScript = `try{var t=localStorage.getItem("duta-teladan-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;document.documentElement.classList.toggle("dark",t==="dark")}}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://dutateladan-stekom.vercel.app"),
  icons: {
    icon: "/brand/topstar-app-icon.svg",
    shortcut: "/brand/topstar-app-icon.svg",
  },
  title: {
    default: "Duta Teladan Universitas STEKOM",
    template: "%s | Duta Teladan Universitas STEKOM",
  },
  description:
    "Program resmi Universitas STEKOM untuk membangun personal branding, skill konten kreator, serta peluang uang saku dan bonus performa.",
  keywords: [
    "Duta Teladan Universitas STEKOM",
    "Content Creator Pelajar",
    "Program Content Creator Universitas STEKOM",
    "Pelatihan Konten Kreator",
    "Personal Branding Kreator",
  ],
  openGraph: {
    title: "Duta Teladan Universitas STEKOM",
    description:
      "Bangun nama, skill, serta peluang uang saku dan bonus performa melalui program Content Creator Development resmi Universitas STEKOM.",
    type: "website",
    locale: "id_ID",
    siteName: "Duta Teladan Universitas STEKOM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={nunito.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
