import Link from "next/link";
import { Sparkles, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-100/70 pb-20 md:pb-8 pt-10 text-neutral-600">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xl font-black text-neutral-900 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white text-xs">
                <Sparkles className="h-4 w-4" />
              </span>
              <span>SEA:NIOR</span>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
              시니어의 소중한 경험과 재능을 콘텐츠로 만들어 세상과 연결하고,
              창작과 사회 참여 활동이 지속되도록 돕는 플랫폼입니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-neutral-900">
              서비스 소개
            </Link>
            <Link href="/works" className="hover:text-neutral-900">
              제작 보관함
            </Link>
            <Link href="/works/new" className="hover:text-neutral-900">
              새 작품 시작
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              현재 버전은 MVP 검증을 위한 공개 데모 환경입니다. 민감한 개인정보는 입력하지 마세요.
            </span>
          </div>
          <div>© {new Date().getFullYear()} SEA:NIOR. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
