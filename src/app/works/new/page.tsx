import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { WorkForm } from "@/components/WorkForm";
import { SupabaseGuide } from "@/components/SupabaseGuide";

export default function NewWorkPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <SupabaseGuide />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-12">
      {/* 뒤로 가기 링크 */}
      <Link
        href="/works"
        className="inline-flex items-center text-sm font-semibold text-neutral-600 hover:text-neutral-900 mb-6 transition"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>보관함으로 돌아가기</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-3 py-1 text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>새로운 도전</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
          오늘 세상에 보여주고 싶은 작품
        </h1>
        <p className="mt-2 text-base sm:text-lg text-neutral-600 leading-relaxed">
          사진이나 영상을 고르고, 담긴 이야기를 편안하게 들려주세요. 멋진 콘텐츠로 탄생할 수 있도록 준비해 드립니다.
        </p>
      </div>

      <WorkForm />
    </div>
  );
}
