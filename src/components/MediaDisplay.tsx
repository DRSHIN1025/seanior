"use client";

import * as React from "react";
import { Image as ImageIcon, Video as VideoIcon, AlertCircle } from "lucide-react";

interface MediaDisplayProps {
  url?: string | null;
  mimeType?: string | null;
  title: string;
  className?: string;
}

export function MediaDisplay({
  url,
  mimeType,
  title,
  className = "",
}: MediaDisplayProps) {
  const [hasError, setHasError] = React.useState(false);

  if (!url) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-400 ${className}`}
      >
        <ImageIcon className="mb-2 h-10 w-10 stroke-[1.5]" />
        <p className="text-base font-medium">등록된 사진이나 영상이 없습니다.</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 ${className}`}
      >
        <AlertCircle className="mb-2 h-8 w-8" />
        <p className="text-base font-semibold">미디어를 불러올 수 없습니다.</p>
        <p className="text-xs text-red-500 mt-1">파일이 비공개 상태이거나 다운로드 만료일 수 있습니다.</p>
      </div>
    );
  }

  const isVideo = mimeType?.startsWith("video/") || url.includes(".mp4");

  if (isVideo) {
    return (
      <div className={`overflow-hidden rounded-2xl border border-neutral-200 bg-black ${className}`}>
        <video
          src={url}
          controls
          playsInline
          className="h-full w-full max-h-[500px] object-contain"
          onError={() => setHasError(true)}
        >
          {title} 영상
        </video>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`${title} 원본 또는 제작 결과`}
        className="h-full w-full max-h-[500px] object-contain transition-transform duration-300 hover:scale-[1.01]"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
