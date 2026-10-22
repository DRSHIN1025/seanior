"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { EXPRESSION_STYLES, ExpressionStyle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MAX_TOTAL_FILE_SIZE } from "@/lib/validation";
import { createContentRequestAction, updateContentRequestAction, ActionState } from "@/app/actions";

interface WorkFormProps {
  initialData?: {
    id: string;
    title: string;
    story: string;
    expression_style: ExpressionStyle;
    media_url?: string | null;
    media_type?: string | null;
    updated_at: string;
  };
  isEdit?: boolean;
}

export function WorkForm({ initialData, isEdit = false }: WorkFormProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 폼 상태
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [story, setStory] = React.useState(initialData?.story || "");
  const [expressionStyle, setExpressionStyle] = React.useState<ExpressionStyle>(
    initialData?.expression_style || "AI 추천"
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [filePreview, setFilePreview] = React.useState<string | null>(
    initialData?.media_url || null
  );
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [removeExistingMedia, setRemoveExistingMedia] = React.useState(false);

  // 음성 인식(STT) 상태
  const [isRecording, setIsRecording] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const [speechError, setSpeechError] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<any>(null);

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [conflictError, setConflictError] = React.useState(false);

  // 음성 인식 초기화
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.lang = "ko-KR";
        recog.continuous = true;
        recog.interimResults = false;

        recog.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setStory((prev) => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
        };

        recog.onerror = (event: any) => {
          console.warn("음성 인식 오류:", event.error);
          setIsRecording(false);
          if (event.error === "not-allowed") {
            setSpeechError("마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해 주세요.");
          } else {
            setSpeechError("음성을 인식하지 못했습니다. 다시 시도하거나 직접 입력해 주세요.");
          }
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  const toggleSpeechRecording = () => {
    if (!recognitionRef.current) return;
    setSpeechError(null);

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("음성 인식 시작 실패:", err);
        setIsRecording(false);
      }
    }
  };

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (!file) return;

    if (file.size > MAX_TOTAL_FILE_SIZE) {
      setFileError("파일 크기는 최대 3MB까지 가능합니다. 더 작은 크기의 사진이나 영상을 골라주세요.");
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
    if (!allowed.includes(file.type)) {
      setFileError("JPG, PNG, WEBP 사진 또는 MP4 영상만 등록할 수 있습니다.");
      return;
    }

    setSelectedFile(file);
    setRemoveExistingMedia(false);

    // 미리보기 URL 생성
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (isEdit && initialData?.media_url) {
      setRemoveExistingMedia(true);
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    setConflictError(false);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("story", story);
      formData.append("expression_style", expressionStyle);

      if (selectedFile) {
        formData.append("media_file", selectedFile);
      }
      if (removeExistingMedia) {
        formData.append("remove_media", "true");
      }

      let res: ActionState;
      if (isEdit && initialData) {
        formData.append("client_updated_at", initialData.updated_at);
        res = await updateContentRequestAction(initialData.id, null, formData);
      } else {
        res = await createContentRequestAction(null, formData);
      }

      if (res?.error) {
        setFormError(res.error);
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
        if (res.conflict) {
          setConflictError(true);
        }
        setIsSubmitting(false);
        return;
      }

      if (res?.success) {
        if (isEdit && initialData) {
          router.push(`/works/${initialData.id}`);
          router.refresh();
        } else if (res.id) {
          router.push(`/works/${res.id}`);
          router.refresh();
        }
        return;
      }
    } catch (err: any) {
      setFormError("작품을 저장하는 중 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* 1. 고르GO: 파일 선택 */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-black text-white">
            1
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
            고르GO : 세상에 보여주고 싶은 작품
          </h2>
        </div>
        <p className="text-base text-neutral-600 mb-6 pl-11">
          스마트폰에 있는 그림, 공예품, 요리, 악기 연주 사진이나 짧은 영상을 골라주세요. (선택 사항, 최대 3MB)
        </p>

        <div className="pl-0 md:pl-11">
          {filePreview ? (
            <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200">
                <span className="text-sm font-semibold text-neutral-700">
                  {selectedFile ? selectedFile.name : "기존 등록된 미디어"}
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

              <div className="max-h-[360px] overflow-hidden rounded-xl flex items-center justify-center bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filePreview}
                  alt="작품 미리보기"
                  className="max-h-[360px] w-auto object-contain"
                />
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center transition hover:border-neutral-500 hover:bg-neutral-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs border border-neutral-200 mb-4">
                <Upload className="h-7 w-7 text-neutral-700" />
              </div>
              <p className="text-lg font-bold text-neutral-900">
                여기를 눌러 사진이나 영상을 선택하세요
              </p>
              <p className="mt-1 text-sm text-neutral-500">
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
            id="media_file_input"
          />

          {fileError && (
            <p className="mt-3 flex items-center gap-1.5 text-base font-semibold text-red-600" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {fileError}
            </p>
          )}
          {fieldErrors.media_file && (
            <p className="mt-3 flex items-center gap-1.5 text-base font-semibold text-red-600" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {fieldErrors.media_file}
            </p>
          )}
        </div>
      </section>

      {/* 2. 말하GO: 제목 및 작품 이야기 */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-black text-white">
            2
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
            말하GO : 작품에 담긴 이야기
          </h2>
        </div>
        <p className="text-base text-neutral-600 mb-6 pl-11">
          이 작품을 만들게 된 계기, 담고 싶은 마음이나 사연을 들려주세요.
        </p>

        <div className="space-y-6 pl-0 md:pl-11">
          {/* 제목 입력 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="title" className="text-lg font-bold text-neutral-900">
                작품 제목 <span className="text-red-500">*</span>
              </label>
              <span className="text-sm text-neutral-400">{title.length} / 80자</span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 70세에 처음 완성한 고향 풍경 유화"
              maxLength={80}
              required
              aria-invalid={Boolean(fieldErrors.title)}
              className={fieldErrors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {fieldErrors.title && (
              <p className="mt-2 text-sm font-semibold text-red-600" role="alert">
                {fieldErrors.title}
              </p>
            )}
          </div>

          {/* 이야기 입력 및 음성 인식 */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label htmlFor="story" className="text-lg font-bold text-neutral-900">
                작품 이야기 들려주기 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleSpeechRecording}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold transition-all ${
                      isRecording
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4" />
                        <span>듣고 있어요 (누르면 멈춤)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 text-neutral-700" />
                        <span>말로 들려주기</span>
                      </>
                    )}
                  </button>
                )}
                <span className="text-sm text-neutral-400">{story.length} / 2,000자</span>
              </div>
            </div>

            {speechError && (
              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                {speechError}
              </div>
            )}

            {isRecording && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
                편안하게 말씀해 주세요. 하시는 말씀이 글자로 적히고 있습니다.
              </div>
            )}

            <Textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="예: 평생 운전만 하다가 손주들의 응원으로 붓을 잡았습니다. 거친 손으로 그렸지만 마음만은 따뜻합니다..."
              rows={6}
              maxLength={2000}
              required
              aria-invalid={Boolean(fieldErrors.story)}
              className={fieldErrors.story ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {fieldErrors.story && (
              <p className="mt-2 text-sm font-semibold text-red-600" role="alert">
                {fieldErrors.story}
              </p>
            )}
            <p className="mt-2 text-xs text-neutral-500">
              * 음성 인식 기능을 사용할 경우 브라우저 음성 인식 서비스를 통해 텍스트로 변환됩니다. 언제든지 텍스트로 직접 수정하실 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 표현 방식 선택 */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-black text-white">
            3
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
            원하는 표현 방식 선택
          </h2>
        </div>
        <p className="text-base text-neutral-600 mb-6 pl-11">
          작품과 이야기가 세상에 어떻게 소개되면 좋을지 분위기를 골라주세요.
        </p>

        <div className="pl-0 md:pl-11 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {EXPRESSION_STYLES.map((style) => {
            const isSelected = expressionStyle === style;
            return (
              <button
                type="button"
                key={style}
                onClick={() => setExpressionStyle(style)}
                className={`flex h-16 flex-col items-center justify-center rounded-xl border-2 px-3 text-center transition-all ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-sm scale-[1.02]"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50"
                }`}
              >
                <span className="text-base font-bold">{style}</span>
              </button>
            );
          })}
        </div>
        {fieldErrors.expression_style && (
          <p className="mt-3 pl-11 text-sm font-semibold text-red-600" role="alert">
            {fieldErrors.expression_style}
          </p>
        )}
      </section>

      {/* 오류 메시지 및 충돌 안내 */}
      {formError && (
        <div
          className={`rounded-2xl border p-5 ${
            conflictError
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-red-300 bg-red-50 text-red-900"
          }`}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 shrink-0 mt-0.5 text-current" />
            <div>
              <p className="text-base font-bold">{formError}</p>
              {conflictError && (
                <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="mt-3 inline-flex items-center rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
                >
                  최신 내용으로 새로고침
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 제출 액션 바 (56px 주요 버튼) */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[140px]"
        >
          돌아가기
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>저장하는 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              <span>{isEdit ? "수정 내용 저장하기" : "제작 요청하기"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
