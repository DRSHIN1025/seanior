"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-neutral-900">
        일시적인 오류가 발생했습니다
      </h2>
      <p className="mt-2 text-base text-neutral-600 max-w-md leading-relaxed">
        화면을 불러오는 도중 문제가 발생했습니다. 네트워크 연결 상태를 확인하시거나 아래 버튼을 눌러 다시 시도해 주세요.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Button onClick={() => reset()} size="lg" className="min-w-[160px]">
          <RotateCcw className="mr-2 h-5 w-5" />
          <span>다시 시도하기</span>
        </Button>
        <Button asChild variant="outline" size="lg" className="min-w-[160px]">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            <span>홈으로 이동</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
