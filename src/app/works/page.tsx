import Link from "next/link";
import { PlusCircle, LayoutGrid, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { getContentRequests } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { WorkCard } from "@/components/WorkCard";
import { SupabaseGuide } from "@/components/SupabaseGuide";
import { Button } from "@/components/ui/button";

interface WorksPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";

export default async function WorksPage({ searchParams }: WorksPageProps) {
  // Supabase 환경 변수가 없는 경우 가이드 화면 표시
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SupabaseGuide />
      </div>
    );
  }

  const resolvedSearchParams = await searchParams;
  const pageParam = parseInt(resolvedSearchParams.page || "1", 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const pageSize = 6;

  let data;
  let fetchError: string | null = null;

  try {
    data = await getContentRequests(currentPage, pageSize);
  } catch (err: any) {
    fetchError = err?.message || "데이터를 불러오는 중 오류가 발생했습니다.";
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-800">목록을 불러오지 못했습니다</h2>
          <p className="mt-2 text-sm text-red-600">{fetchError}</p>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link href="/works">다시 시도하기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { items, totalCount, totalPages } = data!;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-neutral-200 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2">
            <LayoutGrid className="h-7 w-7 text-neutral-900" />
            <span>내 작품 제작 보관함</span>
          </h1>
          <p className="text-base text-neutral-600 mt-1">
            등록하신 작품과 이야기, 제작 진행 상태를 한곳에서 확인하세요. (총 {totalCount}건)
          </p>
        </div>

        <Button asChild className="w-full sm:w-auto">
          <Link href="/works/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>새 작품 시작하기</span>
          </Link>
        </Button>
      </div>

      {/* 목록 본문 */}
      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-neutral-200 bg-white p-12 text-center my-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-4">
            <Inbox className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">
            아직 등록된 작품이 없습니다
          </h2>
          <p className="mt-2 text-base text-neutral-500 max-w-md mx-auto">
            소중한 그림이나 공예, 삶의 추억을 첫 번째 콘텐츠로 만들어 보세요.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/works/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                <span>첫 작품 등록하러 가기</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <WorkCard key={item.id} item={item} />
            ))}
          </div>

          {/* 페이지네이션 (페이지가 2페이지 이상일 때) */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                asChild={currentPage > 1}
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
              >
                {currentPage > 1 ? (
                  <Link href={`/works?page=${currentPage - 1}`}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    이전
                  </Link>
                ) : (
                  <span className="flex items-center opacity-50">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    이전
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-1 px-2 text-sm font-semibold text-neutral-700">
                <span>{currentPage}</span>
                <span className="text-neutral-400">/</span>
                <span>{totalPages} 페이지</span>
              </div>

              <Button
                asChild={currentPage < totalPages}
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
              >
                {currentPage < totalPages ? (
                  <Link href={`/works?page=${currentPage + 1}`}>
                    다음
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                ) : (
                  <span className="flex items-center opacity-50">
                    다음
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
