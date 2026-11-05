import type { Metadata } from "next";

import { RegistrationPage } from "@/components/landing/registration-page";

export const metadata: Metadata = {
  title: "Pendaftaran",
  description:
    "Formulir pendaftaran pelatihan content creator Duta Teladan Universitas STEKOM. Gratis, tanpa biaya daftar.",
};

export default function Register() {
  return <RegistrationPage />;
}
