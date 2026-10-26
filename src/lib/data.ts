import "server-only";
import { getSupabaseAdmin, getStorageBucket, isSupabaseConfigured } from "./supabase";
import { ContentRequest, ContentRequestWithUrls, PaginatedResult } from "./types";

const SIGNED_URL_EXPIRES_IN = 60 * 60; // 1시간 유효

/**
 * 비공개 Storage 파일에 대한 서명된 다운로드 URL(Signed URL)을 발급합니다.
 */
export async function getSignedMediaUrl(path: string | null): Promise<string | null> {
  if (!path || !isSupabaseConfigured()) return null;

  try {
    const supabase = getSupabaseAdmin();
    const bucket = getStorageBucket();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, SIGNED_URL_EXPIRES_IN);

    if (error || !data?.signedUrl) {
      console.warn(`[getSignedMediaUrl] URL 생성 실패: ${path}`, error?.message);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.warn(`[getSignedMediaUrl] 예외 발생: ${path}`, err);
    return null;
  }
}

/**
 * Storage에 파일 업로드 (UUID 고유 파일명 적용)
 */
export async function uploadFileToStorage(
  file: File,
  prefix: "originals" | "results"
): Promise<{ path: string; mimeType: string }> {
  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();

  const fileExt = file.name.split(".").pop() || "bin";
  const uniqueId = crypto.randomUUID();
  const safePath = `${prefix}/${uniqueId}.${fileExt.toLowerCase()}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(safePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error || !data) {
    throw new Error(`파일 저장소 업로드에 실패했습니다: ${error?.message || "알 수 없는 오류"}`);
  }

  return {
    path: data.path,
    mimeType: file.type,
  };
}

/**
 * Storage 파일 삭제
 */
export async function deleteFileFromStorage(path: string | null): Promise<void> {
  if (!path || !isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseAdmin();
    const bucket = getStorageBucket();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.warn(`[deleteFileFromStorage] 파일 삭제 실패: ${path}`, error.message);
    }
  } catch (err) {
    console.warn(`[deleteFileFromStorage] 파일 삭제 예외 발생: ${path}`, err);
  }
}

/**
 * 콘텐츠 제작 건 목록 조회 (페이지네이션 지원)
 */
export async function getContentRequests(
  page = 1,
  pageSize = 6
): Promise<PaginatedResult<ContentRequestWithUrls>> {
  if (!isSupabaseConfigured()) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const supabase = getSupabaseAdmin();

  // 총 건수 조회
  const { count, error: countError } = await supabase
    .from("content_requests")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(`데이터 조회 실패: ${countError.message}`);
  }

  const totalCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  // 생성 시각과 ID 기준 안정 정렬
  const { data, error } = await supabase
    .from("content_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`데이터 목록을 불러올 수 없습니다: ${error.message}`);
  }

  const requests: ContentRequest[] = (data as ContentRequest[]) || [];

  // 각 항목의 서명된 URL 동시 발급
  const itemsWithUrls: ContentRequestWithUrls[] = await Promise.all(
    requests.map(async (req) => {
      const [media_url, result_url] = await Promise.all([
        getSignedMediaUrl(req.media_path),
        getSignedMediaUrl(req.result_path),
      ]);
      return {
        ...req,
        media_url,
        result_url,
      };
    })
  );

  return {
    items: itemsWithUrls,
    totalCount,
    currentPage,
    totalPages,
    pageSize,
  };
}

/**
 * 단일 콘텐츠 제작 건 상세 조회
 */
export async function getContentRequestById(
  id: string
): Promise<ContentRequestWithUrls | null> {
  if (!isSupabaseConfigured()) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("content_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") {
      return null;
    }
    throw new Error(`콘텐츠 상세 조회 실패: ${error.message}`);
  }

  if (!data) return null;

  const req = data as ContentRequest;
  const [media_url, result_url] = await Promise.all([
    getSignedMediaUrl(req.media_path),
    getSignedMediaUrl(req.result_path),
  ]);

  return {
    ...req,
    media_url,
    result_url,
  };
}
