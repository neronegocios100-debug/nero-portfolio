import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nero — UI/UX & Digital Product Designer",
  description:
    "Interactive portfolio of Nero, focused on UI/UX design, digital product interfaces and front-end experiences.",
  applicationName: "Nero Portfolio",
  authors: [{ name: "Nero" }],
  creator: "Nero",
  publisher: "Nero",

  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "Nero — UI/UX & Digital Product Designer",
    description:
      "UI/UX design, digital product interfaces and front-end portfolio experiences.",
    siteName: "Nero Portfolio",
    type: "website",
    images: [
      {
        url: "/brand/nero-browser-preview.png",
        width: 1200,
        height: 630,
        alt: "Nero Portfolio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nero — UI/UX & Digital Product Designer",
    description:
      "UI/UX design, digital product interfaces and front-end portfolio experiences.",
    images: ["/brand/nero-browser-preview.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#070708",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}