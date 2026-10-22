import { Database, Key, Server, FileCode, CheckCircle2 } from "lucide-react";

export function SupabaseGuide() {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50/60 p-6 md:p-10 shadow-xs">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-amber-950">
            Supabase 데이터베이스 연결 필요
          </h2>
          <p className="text-sm text-amber-800">
            실제 데이터를 저장하고 불러오려면 Supabase 프로젝트 연결 설정이 필요합니다.
          </p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        <div className="rounded-2xl bg-white p-5 border border-amber-200 text-neutral-800 shadow-2xs">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs text-white">1</span>
            <span>.env.local 파일 생성 및 환경 변수 설정</span>
          </h3>
          <p className="text-sm text-neutral-600 mb-3 leading-relaxed">
            프로젝트 루트 폴더에 <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-neutral-900">.env.local</code> 파일을 만들고 아래 변수들을 입력하세요:
          </p>
          <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
{`SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_STORAGE_BUCKET=seanior-media
APP_URL=http://localhost:3000`}
          </pre>
          <p className="text-xs text-amber-800 mt-2 font-medium">
            * <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>는 서버 전용 관리자 키이며 절대 브라우저에 노출되거나 Git에 커밋되지 않습니다.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-amber-200 text-neutral-800 shadow-2xs">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs text-white">2</span>
            <span>Supabase SQL Editor에서 테이블 생성</span>
          </h3>
          <p className="text-sm text-neutral-600 mb-2 leading-relaxed">
            Supabase 대시보드 → <strong>SQL Editor</strong>에 접속하여 프로젝트 폴더의 <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-neutral-900">supabase/schema.sql</code> 파일 내용을 복사해 실행(Run)하세요.
          </p>
          <ul className="text-xs text-neutral-600 space-y-1 list-disc pl-5">
            <li><code className="font-mono">content_requests</code> 테이블 및 제약 조건 생성</li>
            <li><code className="font-mono">updated_at</code> 자동 갱신 트리거 생성</li>
            <li>정렬 및 페이지네이션 최적화 인덱스 생성</li>
            <li><code className="font-mono">seanior-media</code> Storage 버킷 생성</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-amber-200 text-neutral-800 shadow-2xs">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs text-white">3</span>
            <span>개발 서버 재시작</span>
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            환경 변수를 저장한 뒤 터미널에서 개발 서버를 재시작(<code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-neutral-900">npm run dev</code>)하면 바로 실제 저장이 연동됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
