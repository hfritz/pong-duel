import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pong Duel",
  description: "Classic Pong. Play solo against AI or challenge a friend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
