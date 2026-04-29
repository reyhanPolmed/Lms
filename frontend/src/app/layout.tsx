import type { Metadata } from "next";
import { Alegreya_Sans, Bricolage_Grotesque } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading"
});

const bodyFont = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Akara LMS",
  description: "Frontend LMS sekolah berbasis Next.js untuk alur belajar siswa."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${headingFont.variable} ${bodyFont.variable} font-body antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
