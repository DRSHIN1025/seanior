import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Edit,
  Quote,
  Palette,
  Clock,
} from "lucide-react";
import { getContentRequestById } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatDate, formatShortDate } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/types";
import { MediaDisplay } from "@/components/MediaDisplay";
import { ReviewPanel } from "@/components/ReviewPanel";
import { DeleteDialog } from "@/components/DeleteDialog";
import { SupabaseGuide } from "@/components/SupabaseGuide";
import { Button } from "@/components/ui/button";

interface WorkDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
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
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <SupabaseGuide />
        </div>
      );
    }
    throw err;
  }

  if (!request) {
    notFound();
  }

  const statusInfo = STATUS_LABELS[request.status];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12">
      {/* 상단 네비게이션 및 액션 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link
          href="/works"
          className="inline-flex items-center text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>보관함 목록으로</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={`/works/${request.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              <span>내용 수정 및 결과 등록</span>
            </Link>
          </Button>
          <DeleteDialog id={request.id} title={request.title} />
        </div>
      </div>

      {/* 상태 안내 배너 */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                  statusInfo?.badgeColor || "bg-neutral-100"
                }`}
              >
                {statusInfo?.label}
              </span>
              <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(request.created_at)} 등록
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 leading-tight">
              {request.title}
            </h1>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              원하는 표현 스타일
            </span>
            <span className="inline-flex items-center rounded-xl bg-neutral-900 text-white px-3.5 py-1.5 text-sm font-bold shadow-2xs">
              <Palette className="mr-1.5 h-4 w-4" />
              {request.expression_style}
            </span>
          </div>
        </div>

        {/* 상태별 상세 설명 */}
        <p className="mt-4 text-base text-neutral-600 leading-relaxed">
          {statusInfo?.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-10">
        {/* 원본 미디어 및 원본 이야기 섹션 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Quote className="h-5 w-5 text-neutral-700" />
            <span>작품 원본과 들려주신 이야기</span>
          </h2>

          {/* 원본 미디어 */}
          {request.media_url ? (
            <div className="mb-6">
              <MediaDisplay
                url={request.media_url}
                mimeType={request.media_type}
                title={`${request.title} 원본`}
              />
            </div>
          ) : (
            <div className="mb-6 p-6 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 text-center text-sm">
              등록된 사진이나 영상 없이 이야기 중심으로 접수된 건입니다.
            </div>
          )}

          {/* 원본 이야기 */}
          <div className="rounded-xl bg-neutral-50 p-6 border border-neutral-200">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              시니어 님이 전해주신 사연
            </h3>
            <p className="text-lg text-neutral-900 leading-relaxed whitespace-pre-wrap font-medium">
              {request.story}
            </p>
          </div>
        </div>

        {/* 제작 결과 및 확인/승인 패널 */}
        <ReviewPanel request={request} />
      </div>
    </div>
  );
}
