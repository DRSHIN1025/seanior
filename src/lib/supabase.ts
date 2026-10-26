import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseAdminInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
    url.trim() !== "" &&
    serviceRoleKey &&
    serviceRoleKey.trim() !== ""
  );
}

export function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || "seanior-media";
}

/**
 * 서버 전용 Supabase 관리자 클라이언트
 * Service Role Key를 사용하여 RLS가 켜진 DB와 비공개 Storage에 안전하게 접근합니다.
 * 'server-only' 모듈을 통해 클라이언트 번들에 절대 포함되지 않도록 강제됩니다.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase 환경 변수(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다. .env.local 파일을 확인해 주세요."
    );
  }

  if (!supabaseAdminInstance) {
    const url = process.env.SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    supabaseAdminInstance = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseAdminInstance;
}
