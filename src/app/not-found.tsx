import Link from "next/link";
import { HelpCircle, Home, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 mb-4">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h2 className="text-3xl font-extrabold text-neutral-900">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="mt-3 text-base text-neutral-600 max-w-md leading-relaxed">
        요청하신 주소가 잘못되었거나 삭제된 작품입니다. 주소를 다시 한번 확인해 주세요.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Button asChild size="lg" className="min-w-[160px]">
          <Link href="/works">
            <LayoutGrid className="mr-2 h-5 w-5" />
            <span>작품 보관함</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="min-w-[160px]">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            <span>첫 화면으로</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
