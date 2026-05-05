import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pong Duel",
  description: "Classic Pong. Play solo against AI or challenge a friend.",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
