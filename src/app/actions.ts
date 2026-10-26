"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import {
  contentRequestSchema,
  revisionRequestSchema,
  testResultSchema,
  validateFile,
  MAX_TOTAL_FILE_SIZE,
} from "@/lib/validation";
import {
  uploadFileToStorage,
  deleteFileFromStorage,
  getContentRequestById,
} from "@/lib/data";
import { ContentRequest } from "@/lib/types";

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  conflict?: boolean;
  id?: string;
};

/**
 * 1. 신규 콘텐츠 제작 요청 등록
 */
export async function createContentRequestAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error: "Supabase 연결 정보가 설정되지 않았습니다. .env.local을 확인해 주세요.",
    };
  }

  const title = (formData.get("title") as string) || "";
  const story = (formData.get("story") as string) || "";
  const expression_style = (formData.get("expression_style") as string) || "";
  const mediaFile = formData.get("media_file") as File | null;

  // 1. 필드 유효성 검증
  const parsed = contentRequestSchema.safeParse({
    title,
    story,
    expression_style,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    return { fieldErrors, error: "입력하신 내용을 다시 한번 확인해 주세요." };
  }

  // 2. 파일 검증
  let uploadedPath: string | null = null;
  let mediaType: string | null = null;

  if (mediaFile && mediaFile.size > 0) {
    const fileValidation = await validateFile(mediaFile);
    if (!fileValidation.valid) {
      return {
        fieldErrors: { media_file: fileValidation.error || "파일 형식이 올바르지 않습니다." },
        error: fileValidation.error,
      };
    }

    try {
      const uploadRes = await uploadFileToStorage(mediaFile, "originals");
      uploadedPath = uploadRes.path;
      mediaType = uploadRes.mimeType;
    } catch (uploadError: any) {
      return {
        error: uploadError?.message || "파일 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      };
    }
  }

  // 3. DB 저장
  const supabase = getSupabaseAdmin();
  let createdId: string | null = null;

  try {
    const { data, error } = await supabase
      .from("content_requests")
      .insert({
        title: parsed.data.title,
        story: parsed.data.story,
        expression_style: parsed.data.expression_style,
        status: "submitted",
        media_path: uploadedPath,
        media_type: mediaType,
        result_path: null,
        result_type: null,
        result_text: "",
        revision_request: "",
        approved_at: null,
      })
      .select("id")
      .single();

    if (error || !data) {
      // 롤백: DB 저장 실패 시 방금 업로드된 파일 정리
      if (uploadedPath) {
        await deleteFileFromStorage(uploadedPath);
      }
      return {
        error: `제작 요청 등록 실패: ${error?.message || "알 수 없는 오류"}`,
      };
    }

    createdId = data.id;
  } catch (err: any) {
    if (uploadedPath) {
      await deleteFileFromStorage(uploadedPath);
    }
    return {
      error: `서버 오류가 발생했습니다: ${err?.message || "알 수 없는 오류"}`,
    };
  }

  revalidatePath("/works");
  return { success: true, id: createdId || undefined };
}

/**
 * 2. 콘텐츠 기본 정보 수정 (낙관적 락 적용, 원본 변경 시 submitted로 리셋)
 */
export async function updateContentRequestAction(
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase 연결 정보가 설정되지 않았습니다." };
  }

  const existing = await getContentRequestById(id);
  if (!existing) {
    return { error: "수정하려는 콘텐츠를 찾을 수 없습니다." };
  }

  const clientUpdatedAt = (formData.get("client_updated_at") as string) || "";
  // 낙관적 동시성 검사
  if (clientUpdatedAt && new Date(existing.updated_at).getTime() !== new Date(clientUpdatedAt).getTime()) {
    return {
      conflict: true,
      error: "다른 사용자가 이미 내용을 수정했습니다. 페이지를 새로고침하여 최신 내용을 확인해 주세요.",
    };
  }

  const title = (formData.get("title") as string) || "";
  const story = (formData.get("story") as string) || "";
  const expression_style = (formData.get("expression_style") as string) || "";
  const removeMedia = formData.get("remove_media") === "true";
  const newMediaFile = formData.get("media_file") as File | null;

  const parsed = contentRequestSchema.safeParse({
    title,
    story,
    expression_style,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0] as string] = err.message;
      }
    });
    return { fieldErrors, error: "입력 내용을 확인해 주세요." };
  }

  let newMediaPath = existing.media_path;
  let newMediaType = existing.media_type;
  let newlyUploadedPath: string | null = null;

  if (newMediaFile && newMediaFile.size > 0) {
    const fileValidation = await validateFile(newMediaFile);
    if (!fileValidation.valid) {
      return {
        fieldErrors: { media_file: fileValidation.error || "파일 형식이 올바르지 않습니다." },
        error: fileValidation.error,
      };
    }

    try {
      const uploadRes = await uploadFileToStorage(newMediaFile, "originals");
      newlyUploadedPath = uploadRes.path;
      newMediaPath = uploadRes.path;
      newMediaType = uploadRes.mimeType;
    } catch (uploadErr: any) {
      return { error: uploadErr.message || "파일 업로드에 실패했습니다." };
    }
  } else if (removeMedia) {
    newMediaPath = null;
    newMediaType = null;
  }

  // 원본 내용(제목, 이야기, 표현 방식, 파일)이 변경되었는지 확인
  const isOriginalChanged =
    existing.title !== parsed.data.title ||
    existing.story !== parsed.data.story ||
    existing.expression_style !== parsed.data.expression_style ||
    existing.media_path !== newMediaPath;

  // 원본이 변경되면 승인이 해제되고 submitted로 전환
  const nextStatus = isOriginalChanged ? "submitted" : existing.status;
  const nextApprovedAt = isOriginalChanged ? null : existing.approved_at;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("content_requests")
    .update({
      title: parsed.data.title,
      story: parsed.data.story,
      expression_style: parsed.data.expression_style,
      media_path: newMediaPath,
      media_type: newMediaType,
      status: nextStatus,
      approved_at: nextApprovedAt,
    })
    .eq("id", id);

  if (error) {
    if (newlyUploadedPath) {
      await deleteFileFromStorage(newlyUploadedPath);
    }
    return { error: `수정 실패: ${error.message}` };
  }

  // 기존 파일이 교체되거나 삭제된 경우 이전 파일 정리
  if (existing.media_path && existing.media_path !== newMediaPath) {
    await deleteFileFromStorage(existing.media_path);
  }

  revalidatePath(`/works/${id}`);
  revalidatePath("/works");
  return { success: true, id };
}

/**
 * 3. 테스트 운영용 제작 결과 등록/수정 (ready 상태로 전환, 승인 초기화)
 */
export async function registerResultAction(
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase 연결 정보가 설정되지 않았습니다." };
  }

  const existing = await getContentRequestById(id);
  if (!existing) {
    return { error: "콘텐츠를 찾을 수 없습니다." };
  }

  const clientUpdatedAt = (formData.get("client_updated_at") as string) || "";
  if (clientUpdatedAt && new Date(existing.updated_at).getTime() !== new Date(clientUpdatedAt).getTime()) {
    return {
      conflict: true,
      error: "다른 탭 또는 사용자가 이미 내용을 변경했습니다. 새로고침 후 다시 시도해 주세요.",
    };
  }

  const result_text = (formData.get("result_text") as string) || "";
  const removeResultFile = formData.get("remove_result_file") === "true";
  const resultFile = formData.get("result_file") as File | null;

  const parsed = testResultSchema.safeParse({ result_text });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "결과 소개글을 확인해 주세요." };
  }

  let newResultPath = existing.result_path;
  let newResultType = existing.result_type;
  let newlyUploadedPath: string | null = null;

  if (resultFile && resultFile.size > 0) {
    const fileValidation = await validateFile(resultFile);
    if (!fileValidation.valid) {
      return {
        fieldErrors: { result_file: fileValidation.error || "파일 형식이 올바르지 않습니다." },
        error: fileValidation.error,
      };
    }

    try {
      const uploadRes = await uploadFileToStorage(resultFile, "results");
      newlyUploadedPath = uploadRes.path;
      newResultPath = uploadRes.path;
      newResultType = uploadRes.mimeType;
    } catch (err: any) {
      return { error: err.message || "제작 결과 파일 업로드 실패" };
    }
  } else if (removeResultFile) {
    newResultPath = null;
    newResultType = null;
  }

  // 제작 결과가 조금이라도 등록되었는지 확인
  const hasResult = Boolean((parsed.data.result_text && parsed.data.result_text.trim().length > 0) || newResultPath);
  const nextStatus = hasResult ? "ready" : "submitted";

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("content_requests")
    .update({
      result_text: parsed.data.result_text,
      result_path: newResultPath,
      result_type: newResultType,
      status: nextStatus,
      approved_at: null, // 제작 결과가 갱신되면 이전 승인은 해제되고 재검토 상태
    })
    .eq("id", id);

  if (error) {
    if (newlyUploadedPath) {
      await deleteFileFromStorage(newlyUploadedPath);
    }
    return { error: `제작 결과 등록 실패: ${error.message}` };
  }

  // 기존 결과 파일 교체 시 이전 파일 정리
  if (existing.result_path && existing.result_path !== newResultPath) {
    await deleteFileFromStorage(existing.result_path);
  }

  revalidatePath(`/works/${id}`);
  revalidatePath("/works");
  return { success: true };
}

/**
 * 4. 수정 요청 등록 (revision_requested 상태로 전환)
 */
export async function requestRevisionAction(
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase 연결 정보가 설정되지 않았습니다." };
  }

  const existing = await getContentRequestById(id);
  if (!existing) {
    return { error: "콘텐츠를 찾을 수 없습니다." };
  }

  const clientUpdatedAt = (formData.get("client_updated_at") as string) || "";
  if (clientUpdatedAt && new Date(existing.updated_at).getTime() !== new Date(clientUpdatedAt).getTime()) {
    return {
      conflict: true,
      error: "다른 변경사항이 있습니다. 새로고침 후 다시 시도해 주세요.",
    };
  }

  const revision_request = (formData.get("revision_request") as string) || "";
  const parsed = revisionRequestSchema.safeParse({ revision_request });

  if (!parsed.success) {
    return {
      fieldErrors: { revision_request: parsed.error.errors[0]?.message || "수정 내용을 입력해 주세요." },
      error: parsed.error.errors[0]?.message || "수정 내용을 입력해 주세요.",
    };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("content_requests")
    .update({
      revision_request: parsed.data.revision_request,
      status: "revision_requested",
      approved_at: null,
    })
    .eq("id", id);

  if (error) {
    return { error: `수정 요청 저장 실패: ${error.message}` };
  }

  revalidatePath(`/works/${id}`);
  revalidatePath("/works");
  return { success: true };
}

/**
 * 5. 최종 승인 (결과 존재 필수, approved 상태 전환, 외부 SNS 게시는 실행되지 않음 명시)
 */
export async function approveContentAction(
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase 연결 정보가 설정되지 않았습니다." };
  }

  const existing = await getContentRequestById(id);
  if (!existing) {
    return { error: "콘텐츠를 찾을 수 없습니다." };
  }

  // 제작 결과가 전혀 없으면 승인 불가
  const hasResult = Boolean(
    (existing.result_text && existing.result_text.trim().length > 0) ||
    existing.result_path
  );

  if (!hasResult) {
    return {
      error: "제작 결과가 아직 등록되지 않아 승인할 수 없습니다. 제작 결과를 먼저 확인해 주세요.",
    };
  }

  const clientUpdatedAt = (formData.get("client_updated_at") as string) || "";
  if (clientUpdatedAt && new Date(existing.updated_at).getTime() !== new Date(clientUpdatedAt).getTime()) {
    return {
      conflict: true,
      error: "다른 변경사항이 발생했습니다. 새로고침 후 다시 승인해 주세요.",
    };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("content_requests")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: `최종 승인 처리 실패: ${error.message}` };
  }

  revalidatePath(`/works/${id}`);
  revalidatePath("/works");
  return { success: true };
}

/**
 * 6. 콘텐츠 삭제 (연결된 Storage 파일도 함께 정리)
 */
export async function deleteContentRequestAction(id: string): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase 연결 정보가 설정되지 않았습니다." };
  }

  const existing = await getContentRequestById(id);
  if (!existing) {
    return { error: "삭제하려는 콘텐츠를 찾을 수 없습니다." };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("content_requests")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: `삭제 실패: ${error.message}` };
  }

  // 삭제 성공 후 연결 파일 정리
  if (existing.media_path) {
    await deleteFileFromStorage(existing.media_path);
  }
  if (existing.result_path) {
    await deleteFileFromStorage(existing.result_path);
  }

  revalidatePath("/works");
  return { success: true };
}
