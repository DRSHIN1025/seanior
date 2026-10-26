import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertCircle, Info } from "lucide-react";
import { getContentRequestById } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { WorkForm } from "@/components/WorkForm";
import { ResultRegistrationForm } from "@/components/ResultRegistrationForm";
import { SupabaseGuide } from "@/components/SupabaseGuide";

interface EditWorkPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditWorkPage({ params }: EditWorkPageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <SupabaseGuide />
      </div>
    );
  }

  const { id } = await params;
  let request;

  try {
    request = await getContentRequestById(id);
  } catch (err: any) {
    if (err?.message === "SUPABASE_NOT_CONFIGURED") {
      return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <SupabaseGuide />
        </div>
      );
    }
    throw err;
  }

  if (!request) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-12">
      {/* 뒤로 가기 링크 */}
      <Link
        href={`/works/${request.id}`}
        className="inline-flex items-center text-sm font-semibold text-neutral-600 hover:text-neutral-900 mb-6 transition"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>작품 상세 화면으로 돌아가기</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          작품 내용 수정 및 결과 등록
        </h1>
        <p className="mt-2 text-base text-neutral-600 leading-relaxed">
          원본 작품 정보나 이야기를 수정하거나, 테스트 운영용 제작 결과를 등록할 수 있습니다.
        </p>

        {/* 공동 테스트 환경 주의 안내 */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">공동 테스트 환경 안내</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              현재 버전은 MVP 검증을 위한 데모이므로 누구나 내용을 수정하고 결과를 등록할 수 있습니다.
              원본(제목, 이야기, 표현 방식, 미디어)을 수정하면 이전 승인이 초기화되고 ‘제작 요청됨(submitted)’ 상태로 돌아갑니다.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* 원본 정보 수정 폼 */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            1. 원본 작품 및 이야기 수정
          </h2>
          <WorkForm
            isEdit
            initialData={{
              id: request.id,
              title: request.title,
              story: request.story,
              expression_style: request.expression_style,
              media_url: request.media_url,
              media_type: request.media_type,
              updated_at: request.updated_at,
            }}
          />
        </div>

        {/* 테스트 운영용 제작 결과 등록 폼 */}
        <div className="pt-6 border-t border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            2. 테스트 제작 결과 등록 (운영자/검증용)
          </h2>
          <ResultRegistrationForm request={request} />
        </div>
      </div>
    </div>
  );
}
