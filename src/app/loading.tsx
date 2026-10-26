import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-800 mb-4 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-neutral-900">
        화면을 불러오는 중입니다...
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        잠시만 기다려 주세요.
      </p>
    </div>
  );
}
