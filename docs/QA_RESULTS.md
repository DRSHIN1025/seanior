# SEA;NIOR QA 검증 결과 보고서 (QA_RESULTS)

- **검증 일시**: 2026-10-23
- **현재 상태**: **Vercel 프로덕션 배포 및 실서버 E2E 검증 완료 (배포 안정성 확인)**
- **배포 주소**: [https://seanior-gamma.vercel.app/](https://seanior-gamma.vercel.app/)
- **GitHub 저장소**: [https://github.com/DRSHIN1025/seanior](https://github.com/DRSHIN1025/seanior) (branch: `mission-6`)
- **실행 환경**: Vercel Serverless Edge/Node Runtime, Next.js 16.4.2 (App Router & Turbopack), React 19.3.1, Supabase Postgres & Storage (`seanior-media`), Chromium Real Browser Session (비로그인/시크릿 환경)

---

## 1. 정적 분석 및 린트 검사 (ESLint)

- **실행 명령어**: `npm run lint` (`eslint .`)
- **설정 파일**: `eslint.config.mjs` (`@next/eslint-plugin-next` core-web-vitals flat config)
- **결과**: **통과 (Exit Code 0, 오류 0건, 경고 0건)**
- **조치 사항**: Next.js 16 및 ESLint 10 환경에 맞춰 순환 참조 문제가 있던 FlatCompat 레거시 방식을 걷어내고 `@next/eslint-plugin-next`의 네이티브 flat config로 전환하여 무결성 확보.

---

## 2. 정적 타입 검사 (TypeScript Typecheck)

- **실행 명령어**: `npx tsc --noEmit`
- **결과**: **통과 (Exit Code 0, 오류 및 경고 0건)**
- Server Actions, 데이터 모델, Radix UI Primitives, Zod 검증 스키마 간 타입 불일치 없음 확인.

---

## 3. 프로덕션 최적화 빌드 검증 (Next.js Production Build)

- **실행 명령어**: `npm run build`
- **결과**: **통과 (Exit Code 0)**
- **라우트 구성**:
  - `○ /` (Static 사전 렌더링)
  - `○ /_not-found` (Static 404 페이지)
  - `ƒ /works` (Dynamic 서버 렌더링)
  - `ƒ /works/[id]` (Dynamic 서버 렌더링)
  - `ƒ /works/[id]/edit` (Dynamic 서버 렌더링)
  - `○ /works/new` (Static 사전 렌더링)

---

## 4. 자동 단위 및 11단계 E2E 워크플로우 통합 테스트 (Vitest)

- **실행 명령어**: `npm test`
- **실행 결과**: **3개 테스트 파일 전체 통과 (31 Passed / 0 Failed)**
- **소요 시간**: 1.01s

| 테스트 파일 | 테스트 수 | 검증 항목 요약 | 결과 |
| :--- | :---: | :--- | :---: |
| `tests/validation.test.ts` | 10건 | Zod 스키마 검증, 공백 및 길이 제한, 허용 스타일 enum, 매직 바이트 검사(JPG, PNG, WEBP, MP4), 위장 파일 차단 | **PASS** |
| `tests/state_transitions.test.ts` | 7건 | 기본 submitted, 결과 등록 시 ready, 결과 부재 시 승인 차단, 승인 후 원본 변경 시 승인 해제, 낙관적 동시성 락 | **PASS** |
| `tests/workflow_integration.test.ts` | 14건 | **11단계 전체 라이프사이클 순차 검증**:<br>1. 등록 $\rightarrow$ 2. 목록 $\rightarrow$ 3. 상세 $\rightarrow$ 4. 새로고침 유지 $\rightarrow$ 5. 원본 수정 $\rightarrow$ 6. 제작 결과 등록 $\rightarrow$ 7. 수정 요청 $\rightarrow$ 8. 결과 변경 $\rightarrow$ 9. 최종 승인 $\rightarrow$ 10. 원본 변경 시 승인 해제 $\rightarrow$ 11. 삭제<br>+ 4대 엣지 케이스(없는 주소, 파일 없는 텍스트 등록, 미등록 승인 차단, 오래된 편집 충돌) | **PASS** |

---

## 5. 로컬 개발 환경 Supabase 연동 E2E 검증

실제 Supabase Postgres 인스턴스 및 `seanior-media` Storage 버킷과 실시간 통신하며 로컬 브라우저 상에서 전체 핵심 흐름을 검증했습니다:

| 검증 시나리오 | 검증 절차 및 관찰 내용 | 결과 |
| :--- | :--- | :---: |
| **1. 파일 첨부 및 새로고침 영속성** | 테스트 이미지(`test_sample.png`)를 첨부하여 작품 등록 $\rightarrow$ `/works/[id]`로 자동 이동 후 원본 이미지 표시 확인 $\rightarrow$ 페이지 새로고침(F5) 후에도 1시간 유효 서명 URL(`getSignedMediaUrl`)을 통해 이미지가 지속적으로 정상 표시됨 확인 | **PASS** |
| **2. 제목·이야기 원본 수정** | `/works/[id]/edit`에서 제목과 사연 수정 후 저장 $\rightarrow$ 상세 화면의 제목과 이야기가 즉시 갱신되고, `/works` 보관함 목록 카드의 제목에도 변경 내용이 정확히 반영됨 확인 | **PASS** |
| **3. 제작 결과 등록 (ready 전환)** | 편집 화면의 '2. 테스트 제작 결과 등록' 영역에서 소개글 입력 및 갱신 $\rightarrow$ 상태 배지가 '제작 결과 도착(ready)'으로 변경되고 결과 텍스트가 ReviewPanel에 표시됨 확인 | **PASS** |
| **4. 수정 요청 (revision_requested)** | ReviewPanel에서 '수정 요청하기' 클릭 $\rightarrow$ 수정 사유 입력 후 전송 $\rightarrow$ 상태 배지가 '수정 요청 중(revision_requested)'으로 전이되고 요청 내용이 화면에 박스로 유지됨 확인 | **PASS** |
| **5. 결과 변경 및 재검토 (ready 복귀)** | 편집 화면에서 수정 요청을 반영한 결과 소개글로 재등록 $\rightarrow$ 상태 배지가 다시 '제작 결과 도착(ready)'으로 복귀됨 확인 | **PASS** |
| **6. 최종 승인 (approved)** | ReviewPanel에서 결과 확인 체크박스 체크 후 '최종 승인 및 완성 확정' 클릭 $\rightarrow$ 상태 배지가 '최종 승인 완료(approved)'로 갱신되고 승인 일시(`approved_at`)가 정확히 표시됨 확인 | **PASS** |
| **7. 비즈니스 규칙: 원본 수정 시 승인 해제** | 승인 완료 상태에서 다시 `/works/[id]/edit`으로 이동하여 원본 제목을 변경 저장 $\rightarrow$ 상태가 자동으로 `submitted(제작 요청됨)`로 리셋되고 `approved_at`이 즉시 해제(null)됨 확인 | **PASS** |
| **8. 삭제 취소 및 확정 무결성** | 상세 화면에서 '삭제하기' 클릭 시 확인 모달 표시 $\rightarrow$ '취소' 클릭 시 데이터 유지 $\rightarrow$ 다시 '삭제 확정' 클릭 시 Supabase DB 레코드 및 연결된 Storage 파일이 영구 삭제되고 `/works`로 안전하게 이동 확인 | **PASS** |
| **9. 8건 합성 데이터 페이지네이션** | 보관함 목록(`/works`)에서 8건의 데이터를 6건 단위로 분할하여 `1 / 2 페이지` 표시 $\rightarrow$ '다음' 버튼 클릭 시 `/works?page=2`로 이동하여 나머지 2건 표시 $\rightarrow$ '이전' 버튼 클릭 시 1페이지로 복귀 확인 | **PASS** |
| **10. 비정상 ID/404 예외 처리** | `/works/non-existent-id-12345` 접근 시 500 크래시 없이 시니어 친화적 404 안내 화면('페이지를 찾을 수 없습니다')과 보관함 링크가 정상 표시됨 확인 | **PASS** |

---

## 6. Vercel 프로덕션 배포 환경(https://seanior-gamma.vercel.app/) 실측 검증 결과

실제 Vercel 프로덕션 배포 주소에서 시크릿/비로그인 Chromium 브라우저 세션을 통해 7대 핵심 항목을 직접 검증했습니다:

| 검증 항목 | 검증 절차 및 관찰 내용 | 결과 |
| :--- | :--- | :---: |
| **1. 비로그인/시크릿 브라우저 접속** | 인증 쿠키/세션이 없는 상태에서 `https://seanior-gamma.vercel.app/` 접속 $\rightarrow$ HTTP 200 정상 응답, 시니어 친화적 브랜드 헤더(`SEA;NIOR`) 및 네비게이션 정상 렌더링 확인 | **PASS** |
| **2. 필수값 오류 검증** | `/works/new`에서 제목과 사연을 비워둔 채 '제작 요청하기' 제출 $\rightarrow$ 필드별 유효성 오류 메시지("제목을 입력해 주세요", "사연을 입력해 주세요") 및 입력 폼 강조 정상 표시 확인 | **PASS** |
| **3. 테스트 작품 등록 및 목록·상세 반영** | 제목(`Autumn Chrysanthemum Garden - Live QA`), 사연, 표현 스타일(`따뜻하게`), 이미지 첨부 후 제출 $\rightarrow$ 상세 화면(`/works/[id]`)으로 자동 이동, 신규 ID(`5df11612-68dc-42be-a651-f38a1145d664`) 발급, 보관함 목록(`/works`) 최상단 카드에 즉시 반영 확인 | **PASS** |
| **4. 새로고침 후 내용·이미지 유지** | 상세 화면에서 브라우저 강제 새로고침(F5) 수행 $\rightarrow$ 제목, 사연, 스타일 배지 유지 및 Supabase Storage 서명 URL(1시간 유효)을 통한 이미지 정상 렌더링 유지 확인 | **PASS** |
| **5. 제목·사연 수정 후 반영** | `/works/[id]/edit`에서 제목(`- Modified`) 및 사연(`(Updated)`) 수정 후 저장 $\rightarrow$ 상세 화면의 제목/사연 갱신 확인 및 보관함 목록(`/works`) 카드 제목 실시간 갱신 확인 | **PASS** |
| **6. 삭제 취소 $\rightarrow$ 삭제 확정 흐름** | 상세 화면에서 '삭제하기' 클릭 시 확인 모달("정말 이 작품 제작 건을 삭제하시겠습니까?") 노출 $\rightarrow$ '취소' 클릭 시 모달 닫힘 및 상세 데이터 유지 확인 $\rightarrow$ '삭제하기' 재클릭 후 '삭제 확정' 클릭 $\rightarrow$ 보관함 목록(`/works`)으로 안전하게 이동 및 해당 항목 완전 제거 확인 | **PASS** |
| **7. 페이지네이션 검증** | 보관함 목록(`/works`) 하단에서 `1 / 2 페이지` 표시 확인 $\rightarrow$ '다음' 버튼 클릭 시 `/works?page=2` 이동 및 잔여 2건 표시 확인 $\rightarrow$ '이전' 버튼 클릭 시 1페이지 복귀 확인 | **PASS** |
| **8. 비정상 상세 주소(404) 처리** | `https://seanior-gamma.vercel.app/works/invalid-uuid-qa-test` 접근 $\rightarrow$ 500 서버 크래시 없이 시니어 친화적 404 페이지("페이지를 찾을 수 없습니다", "작품 보관함" 버튼) 표시 확인 | **PASS** |
| **9. 모바일(390px) & 데스크톱(1440px) 반응형 CTA** | 데스크톱(1440x900) 및 모바일(390x844) 뷰포트에서 상단 헤더, 히어로 CTA("콘텐츠 제작 요청하기", "작품 둘러보기") 클릭 시 `/works/new` 및 `/works`로 정상 이동, 56px 터치 규격 및 가로 스크롤 없음 확인 | **PASS** |

### 데이터 정리 및 잔여 상태 확인
- **기존 베이스라인 데이터 보호**: 기존 등록되어 있던 8건의 시니어 샘플 데이터는 1건도 손상되거나 삭제되지 않고 완전하게 보존되었습니다.
- **테스트 데이터 완전 정리**: 이번 Vercel 실서버 검증에서 생성된 테스트 레코드(`5df11612-68dc-42be-a651-f38a1145d664`)와 Supabase Storage의 첨부 파일(`originals/test_live_1792697144951.png`)은 삭제 확정 플로우를 통해 DB와 Storage 양쪽 모두에서 100% 정리되었습니다. (현재 총 8건 유지, Storage originals 잔여 파일 0건 확인)

---

## 7. 미검증 항목 안내

- **운영자 제작 결과 등록 및 수정 요청/승인 UI 실서버 조작**:
  - `ready` $\rightarrow$ `revision_requested` $\rightarrow$ `approved` 전이 및 승인 후 원본 수정 시 승인 해제 비즈니스 인베리언트는 로컬 통합 테스트(Vitest 31건)와 데이터 계층 검증을 통해 100% 통과되었으나, 이번 Vercel 프로덕션 브라우저 검증에서는 시니어 사용자 관점의 핵심 CRUD 라이프사이클(신규 신청 $\rightarrow$ 이미지 첨부 $\rightarrow$ 새로고침 영속성 $\rightarrow$ 수정 $\rightarrow$ 삭제 취소/확정 $\rightarrow$ 페이지네이션 $\rightarrow$ 404 예외)에 집중하여, 운영자 모드의 승인/재수정 UI 조작은 실서버 상에서 미검증으로 기록합니다.

---

## 8. 검증 중 발견 및 해결한 결함 (Fixes & Hardening)

1. **UUID 형식 검증 및 PostgreSQL 22P02 에러 방어**:
   - *문제*: `/works/non-existent-id`와 같이 UUID 형식이 아닌 URL로 접근할 때 Supabase Postgres가 `22P02 (invalid input syntax for type uuid)` 에러를 반환하여 404 페이지 대신 500 에러 바운더리로 이동하던 현상.
   - *조치*: `getContentRequestById`에 UUID 정규표현식 검증 및 Postgres `22P02` 코드 감지 로직을 추가하여 안전하게 `null`을 반환하고 `notFound()` 404 페이지가 렌더링되도록 수정.
2. **클라이언트 Server Action 라우터 이동 안정성**:
   - *문제*: `createContentRequestAction` 및 `updateContentRequestAction` 내부에서 Next.js `redirect()`를 직접 throw할 때 클라이언트 브라우저의 React 에러 바운더리와의 불일치로 이동이 지연되던 현상.
   - *조치*: Server Action에서 `{ success: true, id }` 결과를 반환하고 클라이언트 컴포넌트(`WorkForm`, `DeleteDialog`)에서 Next.js App Router의 `router.push()` 및 `router.refresh()`를 명시적으로 호출하도록 리팩토링하여 부드럽고 신뢰성 있는 화면 전환 보장.

---

## 9. 최종 배포 및 제출 상태

- **GitHub 저장소**: [https://github.com/DRSHIN1025/seanior](https://github.com/DRSHIN1025/seanior)
- **Vercel 실서비스**: [https://seanior-gamma.vercel.app/](https://seanior-gamma.vercel.app/)
- **보안 원칙 준수**: `SUPABASE_SERVICE_ROLE_KEY` 등 비밀 키는 일체 노출되지 않았으며, `.env.local`은 gitignore에 안전하게 유지됨.



