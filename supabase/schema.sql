-- SEA;NIOR (시니어 경험/재능 콘텐츠화 서비스) Database Schema
-- Supabase Postgres SQL Script

-- 1. UUID 및 시간 갱신 함수 설정
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. 콘텐츠 제작 요청 테이블 (content_requests)
CREATE TABLE IF NOT EXISTS content_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    story TEXT NOT NULL,
    expression_style TEXT NOT NULL DEFAULT 'AI 추천',
    status TEXT NOT NULL DEFAULT 'submitted',
    media_path TEXT,
    media_type TEXT,
    result_path TEXT,
    result_type TEXT,
    result_text TEXT NOT NULL DEFAULT '',
    revision_request TEXT NOT NULL DEFAULT '',
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- 유효성 및 제약 조건
    CONSTRAINT chk_title_length CHECK (char_length(trim(title)) >= 1 AND char_length(trim(title)) <= 80),
    CONSTRAINT chk_story_length CHECK (char_length(trim(story)) >= 1 AND char_length(trim(story)) <= 2000),
    CONSTRAINT chk_expression_style CHECK (expression_style IN ('AI 추천', '감동적으로', '따뜻하게', '전시 느낌', 'SNS 스타일')),
    CONSTRAINT chk_status CHECK (status IN ('submitted', 'ready', 'revision_requested', 'approved')),
    CONSTRAINT chk_result_text_length CHECK (char_length(result_text) <= 4000),
    CONSTRAINT chk_revision_request_length CHECK (char_length(revision_request) <= 1000)
);

-- 3. 트리거 등록
DROP TRIGGER IF EXISTS trigger_content_requests_updated_at ON content_requests;
CREATE TRIGGER trigger_content_requests_updated_at
BEFORE UPDATE ON content_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. 안정적인 목록 정렬 및 페이지네이션을 위한 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_content_requests_created_at_id 
ON content_requests (created_at DESC, id DESC);

-- 5. Row Level Security (RLS) 활성화
-- 초기 데모 단계: 서버 전용 Supabase 서비스 롤 키(Service Role)로 안전하게 접근하도록 구성.
-- anon 및 일반 authenticated 직접 접근은 기본 차단하여 보안 유지 (미션 7에서 사용자별 권한 적용 예정)
ALTER TABLE content_requests ENABLE ROW LEVEL SECURITY;

-- 6. Storage 버킷 설정 안내
-- Supabase 대시보드 Storage 메뉴에서 'seanior-media' 비공개(Private) 버킷을 생성하거나 아래 SQL을 실행합니다.
INSERT INTO storage.buckets (id, name, public)
VALUES ('seanior-media', 'seanior-media', false)
ON CONFLICT (id) DO NOTHING;

