# SEA;NIOR - 시니어의 재능을 세상과 연결하는 콘텐츠 서비스

> **“당신의 재능은 아직 끝나지 않았습니다.”**  
> 시니어의 소중한 경험과 재능을 콘텐츠로 만들어 세상과 연결하고, 자녀나 주변 사람의 도움 없이도 지속적인 창작 활동을 이어갈 수 있도록 돕는 서비스입니다.

---

## 1. 서비스 소개 및 창업 배경

### 브랜드 정체성
- **서비스명**: **`SEA;NIOR`** (항상 대문자로 표기)
- **대상 타깃**: 그림, 공예, 요리, 악기 연주, 원예 등의 재능과 삶의 이야기를 가진 61~74세 액티브 시니어
- **핵심 문제**: “작품과 이야기는 있지만 영상 편집과 게시에서 멈춘다. 자녀나 주변 사람의 도움이 끊기면 콘텐츠 활동도 함께 중단된다.”

### 창업자의 실제 경험에서 출발한 아이디어
창업자의 아버지는 평생 대형 트럭을 운전하셨고, 은퇴 후 73세에 처음으로 붓을 잡으셨습니다. 자녀가 유튜브 ‘할배의 그림’ 채널에 작업 과정을 올려드렸을 때 200명 이상의 구독자와 응원, 그림 구매 문의가 생겼습니다. 그러나 자녀가 바빠져 편집을 돕기 어려워지자 그림은 계속 그리셨지만 유튜브 업로드는 멈추고 말았습니다.

이 경험을 통해 **“새로운 편집기를 배우게 하기보다, 고르고 이야기하고 확인만 하면 콘텐츠 활동을 이어갈 수 있게 하자”**는 **SEA;NIOR**의 3단계 UX가 탄생했습니다.

---

## 2. 핵심 3-Step UX 및 인터랙션

1. **고르GO (사진/영상 선택)**
   - 스마트폰 앨범에서 작품 사진(JPG, PNG, WEBP) 또는 짧은 영상(MP4) 선택 (최대 3MB 한도)
   - 점선 업로드 테두리, 파일 미리보기, 파일 교체 및 지우기 지원
2. **말하GO (이야기 및 분위기 전달)**
   - 대형 텍스트 영역을 통한 작품 사연(최대 2,000자) 입력
   - **음성 인식(STT) 지원**: 마이크 버튼을 눌러 말로 편안하게 들려주기 가능
   - 5가지 표현 스타일 선택 칩 (AI 추천, 감동적으로, 따뜻하게, 전시 느낌, SNS 스타일)
3. **확인하GO (결과 검토 및 승인)**
   - 완성된 콘텐츠 초안(자막 대본 및 편집 파일) 확인
   - 1:1 구체적 수정 요청 기능 (최대 1,000자)
   - 결과 확인 체크 후 원클릭 최종 승인 (`approved_at` 기록)

---

## 3. 기술 스택 (Tech Stack)

- **프레임워크**: Next.js 16.4.2 (App Router & Turbopack)
- **라이브러리**: React 19.3.1, TypeScript 5.7.3
- **스타일링**: Tailwind CSS 4.3.3, shadcn/ui 패턴, Radix UI Primitives
- **데이터베이스 & 스토리지**: Supabase Postgres & Supabase Storage (`seanior-media`)
- **서버 검증 & 접근**: Server Actions, `server-only` 모듈, Zod 3.24.2, 서버 매직 바이트 검사
- **테스트 & 린트**: Vitest 3.0.5 (17개 테스트 통과)
- **아이콘**: Lucide React

---

## 4. 데이터베이스 구조 (`content_requests`)

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | 고유 식별자 |
| `title` | TEXT | NOT NULL, 1~80자 (trim) | 작품 제목 |
| `story` | TEXT | NOT NULL, 1~2,000자 (trim) | 작품에 담긴 이야기 |
| `expression_style`| TEXT | 5개 허용값 CHECK | 원하는 표현 분위기 |
| `status` | TEXT | `submitted`, `ready`, `revision_requested`, `approved` | 상태 전이 |
| `media_path` | TEXT | NULLABLE | 원본 Storage 경로 |
| `media_type` | TEXT | NULLABLE | 원본 MIME 타입 |
| `result_path` | TEXT | NULLABLE | 제작 결과 Storage 경로 |
| `result_type` | TEXT | NULLABLE | 결과 MIME 타입 |
| `result_text` | TEXT | DEFAULT '', 최대 4,000자 | 결과 소개글 / 대본 |
| `revision_request`| TEXT | DEFAULT '', 최대 1,000자 | 최근 수정 요청 내용 |
| `approved_at` | TIMESTAMPTZ | NULLABLE | 최종 승인 완료 시각 |
| `created_at` | TIMESTAMPTZ | DEFAULT `NOW()` (복합 인덱스) | 생성 시각 |
| `updated_at` | TIMESTAMPTZ | DEFAULT `NOW()` (트리거 갱신) | 갱신 시각 (동시성 락) |

---

## 5. 로컬 실행 방법

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 환경 변수 파일(.env.local) 생성 및 설정 (supabase/schema.sql 실행 후)
# SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# SUPABASE_STORAGE_BUCKET=seanior-media

# 3. 로컬 개발 서버 실행
npm run dev
# 브라우저에서 http://localhost:3000 접속

# 4. 단위 및 통합 테스트 실행 (17개 테스트)
npm test

# 5. 프로덕션 빌드 실행
npm run build
```

---

## 6. 환경 변수 안내

| 환경 변수명 | 필수 여부 | 설명 |
| :--- | :---: | :--- |
| `SUPABASE_URL` | 필수 | Supabase 프로젝트 URL (예: `https://xyz.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | 필수 | Supabase Service Role Secret Key (서버 전용 비밀 키, 클라이언트 노출 절대 금지) |
| `SUPABASE_STORAGE_BUCKET` | 선택 | 스토리지 버킷 이름 (기본값: `seanior-media`) |
| `APP_URL` | 선택 | 서비스 기본 도메인 (기본값: `http://localhost:3000`) |

---

## 7. 실제 배포 및 저장소 현황

- **GitHub 저장소 URL**: **미연결** (사용자 계정 생성 및 원격 연결 후 푸시 예정)
- **Vercel 배포 URL**: **미배포** (사용자 Vercel 계정 연동 후 배포 예정)

> 임의의 가짜 URL을 생성하지 않으며, 실제 계정 연결 후 즉시 배포 가능한 상태로 모든 코드와 빌드가 검증되어 있습니다.

---

## 8. QA 검증 결과 요약

- **단위/통합 테스트 (Vitest)**: **17개 테스트 전체 통과 (17 Passed / 0 Failed)**
  - Zod 필드 검증 (제목 80자, 이야기 2,000자, 공백 차단)
  - 매직 바이트 검사 (JPG, PNG, WEBP, MP4 정상 인식 및 위장 파일 차단)
  - 4단계 상태 전이 라이프사이클 및 승인 제약 (결과물 없을 시 승인 불가)
  - 원본 수정 시 승인 해제 및 낙관적 동시성 락(`updated_at`) 충돌 감지
- **TypeScript 타입 검사 (`tsc`)**: 통과 (오류 0건)
- **프로덕션 빌드 (`npm run build`)**: Turbopack 정적/동적 라우트 생성 완료
- **브라우저 검증**: 모바일(390px) 56px 버튼 규격 및 가로 스크롤 없음, 데스크톱(1440px) 반응형, 한글 폰트 정상 렌더링 확인

---

## 9. 미구현 기능 및 제한 사항

1. **외부 AI 영상 생성 API 및 SNS 자동 업로드 API**:
   - 현재 단계에서는 컨시어지 MVP 검증을 위해 사람이 등록한 결과물을 토대로 승인/수정 UX를 제공하며, 외부 API 자동 생성은 후속 개발 범위로 분리되어 있습니다.
2. **개인별 로그인 및 사용자별 RLS 정책**:
   - 본 버전은 코드잇 미션 6 기준 로그인 없는 공개 검증 데모입니다. 누구나 수정 및 조회가 가능하므로 실제 민감한 개인정보 입력은 금지되며, 사용자별 권한 분리는 미션 7에서 구현될 예정입니다.
3. **구독 결제(월 9,900원)**:
   - 초기 사업 모델 가설이며 현재 결제 모듈은 연동되어 있지 않습니다.

