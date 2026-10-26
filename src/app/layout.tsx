import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "SEA;NIOR - 시니어의 재능을 세상과 연결하는 콘텐츠 서비스",
  description:
    "복잡한 편집기 없이 사진을 고르고(고르GO), 이야기를 들려주면(말하GO), 멋진 콘텐츠로 만들어 확인하고(확인하GO) 세상과 소통할 수 있도록 돕습니다.",
  keywords: ["SEA;NIOR", "시니어", "액티브시니어", "콘텐츠제작", "유튜브", "재능나눔"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

