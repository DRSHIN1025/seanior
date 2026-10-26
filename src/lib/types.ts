export const EXPRESSION_STYLES = [
  'AI 추천',
  '감동적으로',
  '따뜻하게',
  '전시 느낌',
  'SNS 스타일',
] as const;

export type ExpressionStyle = typeof EXPRESSION_STYLES[number];

export const CONTENT_STATUSES = [
  'submitted',
  'ready',
  'revision_requested',
  'approved',
] as const;

export type ContentStatus = typeof CONTENT_STATUSES[number];

export const STATUS_LABELS: Record<ContentStatus, { label: string; description: string; badgeColor: string }> = {
  submitted: {
    label: '제작 요청됨',
    description: '이야기와 원본이 전달되었습니다. 콘텐츠 제작을 준비 중입니다.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  ready: {
    label: '확인해 주세요',
    description: '제작 결과가 준비되었습니다. 내용을 확인하고 승인하거나 수정을 요청하세요.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  revision_requested: {
    label: '수정 요청됨',
    description: '수정 요청이 전달되었습니다. 요청 내용을 반영하여 다시 준비합니다.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  approved: {
    label: '최종 승인됨',
    description: '시니어 님의 승인이 완료되었습니다. 추후 SNS 공유 및 전시가 가능합니다.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
};

export interface ContentRequest {
  id: string;
  title: string;
  story: string;
  expression_style: ExpressionStyle;
  status: ContentStatus;
  media_path: string | null;
  media_type: string | null;
  result_path: string | null;
  result_type: string | null;
  result_text: string;
  revision_request: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentRequestWithUrls extends ContentRequest {
  media_url?: string | null;
  result_url?: string | null;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
