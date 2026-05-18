import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import "./globals.css";

const poppins = localFont({
  src: [
    {
      path: "./fonts/poppins/poppins-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/poppins/poppins-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/poppins/poppins-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/poppins/poppins-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Akara LMS Guru",
  description: "Teacher dashboard for managing modules, lessons, quizzes, and student progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
