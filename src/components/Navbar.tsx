"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Home, Layers, Heart, HelpCircle, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/#service-intro", label: "서비스 소개", icon: Home },
    { href: "/#process", label: "3단계 과정 (고르GO·말하GO·확인하GO)", icon: Layers },
    { href: "/#story", label: "창업 이야기", icon: Heart },
    { href: "/#faq", label: "자주 묻는 질문", icon: HelpCircle },
  ];

  return (
    <>
      {/* 상단 고정 헤더 */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-black tracking-tight text-neutral-900 transition-opacity hover:opacity-90"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>SEA;NIOR</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-semibold text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#process"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 px-5 text-base font-bold text-white shadow-sm transition hover:bg-neutral-800"
            >
              <span>과정 둘러보기</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 md:hidden"
            aria-label="메뉴 열기/닫기"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 모바일 햄버거 드롭다운 */}
        {mobileMenuOpen && (
          <div className="border-b border-neutral-200 bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[52px] items-center gap-3 rounded-xl px-4 text-base font-bold text-neutral-800 hover:bg-neutral-100 transition"
                  >
                    <Icon className="h-5 w-5 text-neutral-500" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
              <div className="pt-2">
                <a
                  href="#process"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[56px] w-full items-center justify-center rounded-xl bg-neutral-900 text-base font-bold text-white shadow-sm hover:bg-neutral-800"
                >
                  <span>3단계 과정 바로보기</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 모바일 하단 탭바 (390px 뷰포트 시니어 엄지 터치 최적화) */}
      <nav
        className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-neutral-200 bg-white/95 backdrop-blur-md px-2 md:hidden"
        aria-label="모바일 하단 메뉴"
      >
        <a
          href="/#service-intro"
          className="flex flex-1 flex-col items-center justify-center py-1 text-neutral-800 hover:text-neutral-950 font-bold"
        >
          <Home className="h-5 w-5 text-neutral-900" />
          <span className="text-xs mt-1">소개</span>
        </a>

        <a
          href="/#process"
          className="flex flex-1 flex-col items-center justify-center py-1 text-neutral-800 hover:text-neutral-950 font-bold"
        >
          <Layers className="h-5 w-5 text-neutral-900" />
          <span className="text-xs mt-1">3단계 과정</span>
        </a>

        <a
          href="/#story"
          className="flex flex-1 flex-col items-center justify-center py-1 text-neutral-800 hover:text-neutral-950 font-bold"
        >
          <Heart className="h-5 w-5 text-neutral-900" />
          <span className="text-xs mt-1">창업 이야기</span>
        </a>

        <a
          href="/#faq"
          className="flex flex-1 flex-col items-center justify-center py-1 text-neutral-800 hover:text-neutral-950 font-bold"
        >
          <HelpCircle className="h-5 w-5 text-neutral-900" />
          <span className="text-xs mt-1">질문 답변</span>
        </a>
      </nav>
    </>
  );
}
