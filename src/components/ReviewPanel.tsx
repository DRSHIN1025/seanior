"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  FileEdit,
  Clock,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { ContentRequestWithUrls, STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaDisplay } from "@/components/MediaDisplay";
import {
  requestRevisionAction,
  approveContentAction,
  ActionState,
} from "@/app/actions";

interface ReviewPanelProps {
  request: ContentRequestWithUrls;
}

export function ReviewPanel({ request }: ReviewPanelProps) {
  const router = useRouter();

  // 수정 요청 상태
  const [showRevisionForm, setShowRevisionForm] = React.useState(false);
  const [revisionText, setRevisionText] = React.useState(request.revision_request || "");
  const [isSubmittingRevision, setIsSubmittingRevision] = React.useState(false);
  const [revisionError, setRevisionError] = React.useState<string | null>(null);

  // 승인 상태
  const [approvalConfirmed, setApprovalConfirmed] = React.useState(false);
  const [isSubmittingApproval, setIsSubmittingApproval] = React.useState(false);
  const [approvalError, setApprovalError] = React.useState<string | null>(null);

  const hasResult = Boolean(
    (request.result_text && request.result_text.trim().length > 0) ||
    request.result_path
  );

  // 1. 수정 요청 제출
  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRevision) return;

    if (!revisionText.trim()) {
      setRevisionError("수정하고 싶은 내용을 구체적으로 입력해 주세요.");
      return;
    }

    setIsSubmittingRevision(true);
    setRevisionError(null);

    try {
      const formData = new FormData();
      formData.append("revision_request", revisionText);
      formData.append("client_updated_at", request.updated_at);

      const res: ActionState = await requestRevisionAction(request.id, null, formData);
      if (res?.error) {
        setRevisionError(res.error);
        setIsSubmittingRevision(false);
      } else {
        setShowRevisionForm(false);
        setIsSubmittingRevision(false);
        router.refresh();
      }
    } catch (err: any) {
      setRevisionError(err?.message || "수정 요청 중 오류가 발생했습니다.");
      setIsSubmittingRevision(false);
    }
  };

  // 2. 최종 승인 제출
  const handleApproveSubmit = async () => {
    if (isSubmittingApproval) return;
    if (!hasResult) {
      setApprovalError("등록된 제작 결과가 없어 승인할 수 없습니다.");
      return;
    }
    if (!approvalConfirmed) {
      setApprovalError("결과물 확인 체크박스를 선택해 주세요.");
      return;
    }

    setIsSubmittingApproval(true);
    setApprovalError(null);

    try {
      const formData = new FormData();
      formData.append("client_updated_at", request.updated_at);

      const res: ActionState = await approveContentAction(request.id, null, formData);
      if (res?.error) {
        setApprovalError(res.error);
        setIsSubmittingApproval(false);
      } else {
        setIsSubmittingApproval(false);
        router.refresh();
      }
    } catch (err: any) {
      setApprovalError(err?.message || "최종 승인 중 오류가 발생했습니다.");
      setIsSubmittingApproval(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 제작 결과 소개 카드 */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-neutral-800" />
              <span>확인하GO : 세상에 보여질 내 작품 (제작 결과)</span>
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              시니어 님의 이야기와 원본을 바탕으로 정성스럽게 구성한 콘텐츠 초안입니다.
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-bold border ${
              STATUS_LABELS[request.status]?.badgeColor || "bg-neutral-100"
            }`}
          >
            {STATUS_LABELS[request.status]?.label}
          </span>
        </div>

        {/* 결과 미디어가 있는 경우 */}
        {request.result_url && (
          <div className="mb-6">
            <MediaDisplay
              url={request.result_url}
              mimeType={request.result_type}
              title={`${request.title} 제작 결과물`}
            />
          </div>
        )}

        {/* 결과 소개글 */}
        {request.result_text ? (
          <div className="rounded-xl bg-neutral-50 p-6 border border-neutral-200">
            <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">
              제작 콘텐츠 소개글 / 자막 대본
            </h4>
            <p className="text-lg text-neutral-900 leading-relaxed whitespace-pre-wrap font-medium">
              {request.result_text}
            </p>
          </div>
        ) : (
          !request.result_url && (
            <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-10 text-center">
              <Clock className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-800">
                현재 콘텐츠 초안을 정성스럽게 준비하고 있습니다
              </h3>
              <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
                이야기와 원본을 토대로 멋진 결과물을 준비 중입니다. 잠시 후 다시 확인해 주시거나,
                테스트 운영을 위해 수정 화면에서 직접 결과를 등록해 보실 수 있습니다.
              </p>
            </div>
          )
        )}

        {/* 최근 수정 요청 내역이 있는 경우 */}
        {request.revision_request && (
          <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50/70 p-5">
            <div className="flex items-center gap-2 text-purple-900 font-bold mb-2">
              <RotateCcw className="h-5 w-5" />
              <span>최근 전달된 수정 요청 내용</span>
            </div>
            <p className="text-base text-purple-950 leading-relaxed whitespace-pre-wrap">
              {request.revision_request}
            </p>
          </div>
        )}
      </div>

      {/* 상태별 액션 영역 */}
      {request.status === "approved" ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-emerald-950">
                최종 승인이 완료된 작품입니다!
              </h3>
              <p className="text-base text-emerald-800 leading-relaxed">
                승인 시각: {formatDate(request.approved_at)}
              </p>
              <p className="text-sm text-emerald-700 leading-relaxed">
                * 최종 승인은 결과 확인을 마쳤음을 의미합니다. 현재 MVP 버전에서는 외부 SNS 자동 게시는 포함되어 있지 않으며,
                결과 파일이나 글을 복사하여 유튜브·카카오톡·인스타그램 등에 직접 공유하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      ) : hasResult ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-xl font-bold text-neutral-900">
            결과가 마음에 드시나요?
          </h3>

          {!showRevisionForm ? (
            <div className="space-y-6">
              {/* 승인 체크박스 */}
              <label className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={approvalConfirmed}
                  onChange={(e) => {
                    setApprovalConfirmed(e.target.checked);
                    setApprovalError(null);
                  }}
                  className="h-6 w-6 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 mt-0.5"
                />
                <div className="text-base leading-relaxed">
                  <span className="font-bold text-neutral-900">
                    위 제작 결과물을 꼼꼼히 확인하였으며, 이대로 마음에 듭니다.
                  </span>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    체크 후 최종 승인 버튼을 누르시면 승인 상태로 완료됩니다.
                  </p>
                </div>
              </label>

              {approvalError && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {approvalError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRevisionForm(true)}
                  className="w-full sm:w-1/2"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  수정 요청하기
                </Button>
                <Button
                  type="button"
                  onClick={handleApproveSubmit}
                  disabled={!approvalConfirmed || isSubmittingApproval}
                  className="w-full sm:w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmittingApproval ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>승인 처리 중...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      <span>최종 승인 완료하기</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* 수정 요청 폼 */
            <form onSubmit={handleRevisionSubmit} className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label htmlFor="revision_request_input" className="text-base font-bold text-neutral-900">
                  어떤 부분을 수정하고 싶으신가요? <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-neutral-400">{revisionText.length} / 1,000자</span>
              </div>
              <Textarea
                id="revision_request_input"
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
                placeholder="예: 제목에 '손주에게 전하는 마음'이라는 문구를 꼭 넣어주세요. 글씨를 조금 더 크고 따뜻한 느낌으로 바꿔주세요."
                rows={4}
                maxLength={1000}
                required
              />

              {revisionError && (
                <p className="text-sm font-semibold text-red-600" role="alert">
                  {revisionError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRevisionForm(false)}
                  disabled={isSubmittingRevision}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingRevision}
                >
                  {isSubmittingRevision ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>전송 중...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      <span>수정 요청 전달하기</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
