"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteContentRequestAction } from "@/app/actions";

interface DeleteDialogProps {
  id: string;
  title: string;
}

export function DeleteDialog({ id, title }: DeleteDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await deleteContentRequestAction(id);
      if (res?.error) {
        setError(res.error);
        setIsDeleting(false);
      } else {
        setOpen(false);
        router.push("/works");
        router.refresh();
      }
    } catch (err: any) {
      setError("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">
          <Trash2 className="mr-2 h-5 w-5" />
          삭제하기
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-2">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            정말 이 작품 제작 건을 삭제하시겠습니까?
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            ‘<strong className="text-neutral-900">{title}</strong>’ 제작 요청과 등록된 모든 사진 및 결과물이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="w-full sm:w-1/2"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-1/2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>삭제 중...</span>
              </>
            ) : (
              <span>삭제 확정</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
