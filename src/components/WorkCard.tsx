import Link from "next/link";
import { ContentRequestWithUrls, STATUS_LABELS } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Image as ImageIcon, Video as VideoIcon } from "lucide-react";

interface WorkCardProps {
  item: ContentRequestWithUrls;
}

export function WorkCard({ item }: WorkCardProps) {
  const statusInfo = STATUS_LABELS[item.status] || {
    label: item.status,
    badgeColor: "bg-neutral-100 text-neutral-800",
  };

  const isVideo = item.media_type?.startsWith("video/") || item.media_path?.endsWith(".mp4");
  const displayUrl = item.result_url || item.media_url;

  return (
    <Link href={`/works/${item.id}`} className="group block focus:outline-none">
      <Card className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:border-neutral-400 group-hover:shadow-md">
        {/* 상단 썸네일 영역 */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 border-b border-neutral-200">
          {displayUrl ? (
            isVideo ? (
              <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-white">
                <VideoIcon className="h-10 w-10 text-neutral-300" />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayUrl}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            )
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-neutral-400">
              <ImageIcon className="h-10 w-10 stroke-[1.5] mb-1" />
              <span className="text-xs">미디어 없음</span>
            </div>
          )}

          {/* 상태 뱃지 (우측 상단) */}
          <div className="absolute right-3 top-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold shadow-xs ${statusInfo.badgeColor}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* 표현 스타일 뱃지 (좌측 상단) */}
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
              {item.expression_style}
            </span>
          </div>
        </div>

        {/* 본문 정보 */}
        <CardContent className="p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-medium text-neutral-400 mb-1">
              {formatShortDate(item.created_at)}
            </div>
            <h3 className="text-xl font-bold text-neutral-900 line-clamp-1 group-hover:text-neutral-700">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {item.story}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100 text-sm font-semibold text-neutral-900">
            <span>자세히 보기</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
