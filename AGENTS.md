# SEA;NIOR Agent Guidelines & Project Rules

## 1. Product Identity
- **Brand Name**: Always written in uppercase as **`SEA;NIOR`**.
- **Mission**: 시니어의 경험과 재능(그림, 공예, 요리, 악기 등)을 콘텐츠로 만들어 세상과 연결하고 지속적인 창작 활동을 지원하는 서비스.
- **Target Audience**: 61~74세 액티브 시니어. 스마트폰, 카톡, 유튜브는 쓰지만 편집·자막·업로드가 어려운 사용자.
- **Core Problem**: “작품과 이야기는 있지만 편집과 게시에서 멈춘다. 자녀나 주변 사람의 도움이 끊기면 콘텐츠 활동도 중단된다.”
- **Core UX**: 
  - **고르GO**: 사진·영상 선택 (최대 3MB, 고유 스토리지)
  - **말하GO**: 음성 또는 글(텍스트)로 사연 전달 + 표현 스타일 선택
  - **확인하GO**: 결과 확인, 수정 요청, 최종 승인

## 2. Tech Stack & Architecture
- **Framework**: Next.js 16.4.2 (App Router), React 19.3.1
- **Styling**: Tailwind CSS 4.3.3, shadcn/ui pattern with Radix UI primitives
- **Database & Storage**: Supabase Postgres & Supabase Storage (`seanior-media`)
- **Server Data Access**: Next.js Server Actions with `import "server-only"`, protected admin client (`SUPABASE_SERVICE_ROLE_KEY`)
- **Validation**: Zod schema validation + server-side file magic bytes verification (JPEG, PNG, WEBP, MP4)

## 3. Database & State Transition Rules
- **Table**: `content_requests`
- **Statuses**:
  - `submitted`: New submission created
  - `ready`: Result registered (operator draft text and/or result file)
  - `revision_requested`: Revision request submitted with mandatory details
  - `approved`: Senior confirmed and approved (records `approved_at`)
- **Business Transition Invariants**:
  - Original content modification (title, story, style, media) resets status to `submitted` and clears `approved_at`.
  - Result modification resets status to `ready` and clears `approved_at`.
  - Approval is strictly blocked if there is no result (`result_text` empty and `result_path` null).
  - Optimistic concurrency control via `updated_at` must be verified before mutation to prevent overwriting.

## 4. Security & Environment Variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (NEVER leak to browser bundles, never prefix with `NEXT_PUBLIC_`)
- `SUPABASE_STORAGE_BUCKET` (default: `seanior-media`)
- `.env.local` is strictly excluded from Git.

## 5. Senior-Friendly Design System
- Base viewport: 390px mobile up to 1440px desktop.
- Buttons: 56px standard height (`min-h-[56px]`), high-contrast dark buttons.
- Typography: Large Korean fonts (Noto Sans KR, Apple SD Gothic Neo, Pretendard).
- Form inputs: Generous padding, clear character counts, accessible error announcements (`aria-live`, `aria-invalid`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

