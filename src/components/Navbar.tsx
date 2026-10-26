"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, PlusCircle, LayoutGrid, Home, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/", label: "소개", icon: Home },
    { href: "/works", label: "제작 보관함", icon: LayoutGrid },
    { href: "/works/new", label: "새 작품 시작", icon: PlusCircle, isPrimary: true },
  ];

  return (
    <>
      {/* 상단 헤더 */}
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
            <Link
              href="/"
              className={cn(
                "text-base font-semibold transition-colors hover:text-neutral-900",
                pathname === "/" ? "text-neutral-900 underline underline-offset-8 decoration-2" : "text-neutral-600"
              )}
            >
              서비스 소개
            </Link>
            <Link
              href="/works"
              className={cn(
                "text-base font-semibold transition-colors hover:text-neutral-900",
                pathname.startsWith("/works") && pathname !== "/works/new"
                  ? "text-neutral-900 underline underline-offset-8 decoration-2"
                  : "text-neutral-600"
              )}
            >
              제작 보관함
            </Link>
            <Link
              href="/works/new"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 px-5 text-base font-bold text-white shadow-sm transition hover:bg-neutral-800"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              첫 작품 시작하기
            </Link>
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
            aria-label="메뉴 열기"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-neutral-200 bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-semibold",
                pathname === "/" ? "bg-neutral-100 text-neutral-900" : "text-neutral-700 hover:bg-neutral-50"
              )}
            >
              <Home className="h-5 w-5" />
              서비스 소개
            </Link>
            <Link
              href="/works"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-semibold",
                pathname.startsWith("/works") && pathname !== "/works/new"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-700 hover:bg-neutral-50"
              )}
            >
              <LayoutGrid className="h-5 w-5" />
              제작 보관함
            </Link>
            <Link
              href="/works/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-lg font-bold text-white shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              첫 작품 시작하기
            </Link>
          </div>
        )}
      </header>

      {/* 모바일 전용 하단 고정 탭바 (Figma 모바일 앱 스타일 390px 최적화) */}
      <div className="md:hidden fixed bottom-0 left-0 z-40 w-full border-t border-neutral-200 bg-white/95 pb-safe backdrop-blur-md">
        <div className="grid h-16 grid-cols-3 items-center">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs font-semibold py-1",
              pathname === "/" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
            )}
          >
            <Home className="h-5 w-5" />
            <span>소개</span>
          </Link>
          <Link
            href="/works"
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs font-semibold py-1",
              pathname.startsWith("/works") && pathname !== "/works/new"
                ? "text-neutral-900 font-bold"
                : "text-neutral-400 hover:text-neutral-700"
            )}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>보관함</span>
          </Link>
          <Link
            href="/works/new"
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs font-semibold py-1",
              pathname === "/works/new" ? "text-neutral-900 font-bold" : "text-neutral-400 hover:text-neutral-700"
            )}
          >
            <PlusCircle className="h-5 w-5 text-neutral-900" />
            <span className="text-neutral-900 font-bold">시작하기</span>
          </Link>
        </div>
      </div>
    </>
  );
}

