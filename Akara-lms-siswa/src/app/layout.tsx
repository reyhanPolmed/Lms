import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
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
      <body className={`${poppins.variable} font-body antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
