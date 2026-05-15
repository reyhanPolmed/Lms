import type { ReactNode } from "react";

export default function LoginLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="h-dvh overflow-hidden">{children}</div>;
}
