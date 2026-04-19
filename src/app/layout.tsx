import type { Metadata } from "next";
import { BookmarkCatalogInit } from "@/components/bookmark-catalog-init";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserStateProvider } from "@/context/UserStateContext";
import { getTools } from "@/lib/api";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://niubility.io"),
  title: "Niubility — Web3 & AI navigation hub",
  description:
    "Free Web3 + AI navigation: discover wallets, job boards, research and media sources, AI developer tools, security resources, and community signals.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const listings = await getTools();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark min-h-dvh bg-zinc-950 antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-zinc-950 text-zinc-100">
        <BookmarkCatalogInit listings={listings} />
        <LanguageProvider>
          <UserStateProvider>{children}</UserStateProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
