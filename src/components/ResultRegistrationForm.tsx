"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Upload,
  X,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { ContentRequestWithUrls } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_TOTAL_FILE_SIZE } from "@/lib/validation";
import { registerResultAction, ActionState } from "@/app/actions";

interface ResultRegistrationFormProps {
  request: ContentRequestWithUrls;
}

export function ResultRegistrationForm({ request }: ResultRegistrationFormProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [resultText, setResultText] = React.useState(request.result_text || "");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [filePreview, setFilePreview] = React.useState<string | null>(
    request.result_url || null
  );
  const [removeExistingResultFile, setRemoveExistingResultFile] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (!file) return;

    if (file.size > MAX_TOTAL_FILE_SIZE) {
      setFileError("결과 파일 크기는 최대 3MB까지 가능합니다.");
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
    if (!allowed.includes(file.type)) {
      setFileError("JPG, PNG, WEBP 이미지 또는 MP4 영상만 지원합니다.");
      return;
    }

    setSelectedFile(file);
    setRemoveExistingResultFile(false);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (request.result_url) {
      setRemoveExistingResultFile(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("result_text", resultText);
      formData.append("client_updated_at", request.updated_at);

      if (selectedFile) {
        formData.append("result_file", selectedFile);
      }
      if (removeExistingResultFile) {
        formData.append("remove_result_file", "true");
      }

      const res: ActionState = await registerResultAction(request.id, null, formData);

      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
      } else {
        setSuccess(true);
        setIsSubmitting(false);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "결과 등록 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-6 md:p-8">
        <div className="flex items-center gap-2 text-indigo-950 font-bold mb-1">
          <Sparkles className="h-6 w-6 text-indigo-700" />
          <h3 className="text-xl font-bold">
            제작 결과 등록 · 테스트 운영용
          </h3>
        </div>
        <p className="text-sm text-indigo-800 leading-relaxed mb-6">
          실제 외부 AI API 및 SNS 연동 전, 제작 결과(자막 소개글 또는 편집된 이미지/영상)를 등록하여
          시니어가 확인하고 수정·승인하는 전체 UX 흐름을 테스트하는 영역입니다.
          (결과가 등록되면 상태가 자동으로 <strong>‘확인해 주세요(ready)’</strong>로 전환됩니다)
        </p>

        <div className="space-y-6">
          {/* 결과 소개글 / 자막 대본 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="result_text" className="text-base font-bold text-neutral-900">
                콘텐츠 결과 소개글 / 자막 대본
              </label>
              <span className="text-xs text-neutral-500">{resultText.length} / 4,000자</span>
            </div>
            <Textarea
              id="result_text"
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              placeholder="예: [할배의 그림] 평생 트럭을 몰던 73세 아버지가 처음 붓을 들고 그린 따뜻한 고향 풍경 이야기입니다..."
              rows={5}
              maxLength={4000}
            />
          </div>

          {/* 결과 이미지/영상 파일 업로드 */}
          <div>
            <label className="text-base font-bold text-neutral-900 block mb-2">
              완성된 콘텐츠 파일 (이미지 또는 영상, 최대 3MB)
            </label>

            {filePreview ? (
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200">
                  <span className="text-sm font-semibold text-neutral-700">
                    {selectedFile ? selectedFile.name : "기존 등록된 결과물"}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                    파일 지우기
                  </button>
                </div>
                <div className="max-h-[300px] overflow-hidden rounded-lg flex items-center justify-center bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filePreview}
                    alt="결과물 미리보기"
                    className="max-h-[300px] w-auto object-contain"
                  />
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-300 bg-white p-6 text-center transition hover:border-indigo-500 hover:bg-indigo-50/50"
              >
                <Upload className="h-6 w-6 text-indigo-600 mb-2" />
                <p className="text-sm font-bold text-neutral-900">
                  완성된 편집본 사진이나 영상 첨부
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  JPG, PNG, WEBP 이미지 또는 MP4 영상 (3MB 이하)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4"
              onChange={handleFileChange}
              className="hidden"
            />

            {fileError && (
              <p className="mt-2 text-sm font-semibold text-red-600">{fileError}</p>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              제작 결과가 성공적으로 등록되었습니다. 상세 화면에서 검토 상태를 확인하세요.
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-700 hover:bg-indigo-800 text-white min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>결과 저장 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  <span>테스트 제작 결과 등록하기</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
