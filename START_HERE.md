# SEA;NIOR 시작 가이드 (초보자용 3분 완성 안내)

환영합니다! **SEA;NIOR**는 61~74세 시니어 분들이 복잡한 영상 편집기 없이도 자신의 소중한 재능과 이야기를 멋진 콘텐츠로 만들고 세상과 소통할 수 있도록 돕는 서비스입니다.

이 문서는 개발 경험이 없는 초보자도 한 단계씩 따라 하면 바로 프로젝트를 실행하고 검증할 수 있도록 작성되었습니다.

---

## 1. 프로젝트 실행 준비 (딱 3단계)

### 단계 1: 환경 변수 파일(`.env.local`) 생성하기
프로젝트 폴더 최상단에 `.env.local` 파일을 만들고 아래 내용을 입력합니다.
(Supabase 대시보드 `Project Settings` → `API` 메뉴에서 확인하실 수 있습니다)

```bash
# Supabase 프로젝트 URL
SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Service Role Key (주의: 브라우저에 노출되지 않는 비밀 키입니다)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# Storage 버킷 이름 (기본값)
SUPABASE_STORAGE_BUCKET=seanior-media

# 로컬 개발 주소
APP_URL=http://localhost:3000
```

> **참고**: 아직 Supabase 계정이 없거나 키를 입력하지 않아도 랜딩 페이지는 정상적으로 열리며, 데이터 페이지 접속 시 친절한 설정 가이드가 표시됩니다.

---

### 단계 2: Supabase에 데이터베이스 테이블 만들기
1. [Supabase 대시보드](https://supabase.com)에 로그인 후 프로젝트를 엽니다.
2. 좌측 메뉴에서 **SQL Editor**를 누릅니다.
3. 이 프로젝트의 `supabase/schema.sql` 파일 내용을 전체 복사하여 붙여넣고 **Run** 버튼을 클릭합니다.
4. `content_requests` 테이블과 `seanior-media` Storage 버킷이 자동으로 준비됩니다.

---

### 단계 3: 로컬 개발 서버 실행하기
터미널에서 아래 명령어를 실행합니다:

```bash
# 로컬 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000` 주소로 접속하면 바로 서비스를 이용하실 수 있습니다!

---

## 2. 주요 기능 및 화면 주소

- **서비스 소개 (랜딩 페이지)**: `http://localhost:3000/`
  - 창업 배경(73세 트럭 운전사 아버지의 이야기)과 고르GO·말하GO·확인하GO 3단계 UX 소개
- **내 작품 제작 보관함**: `http://localhost:3000/works`
  - 접수된 콘텐츠 제작 건 목록, 상태 뱃지, 페이지네이션
- **첫 작품 시작하기**: `http://localhost:3000/works/new`
  - 1단계: 사진/영상 선택 (고르GO)
  - 2단계: 제목 및 이야기 작성 (말하GO, 음성인식 지원)
  - 3단계: 원하는 분위기 선택
- **작품 상세 및 검토**: `http://localhost:3000/works/[id]`
  - 원본 확인, 제작 결과 검토, 1:1 수정 요청 및 최종 승인
- **내용 수정 및 테스트 결과 등록**: `http://localhost:3000/works/[id]/edit`
  - 원본 정보 수정 및 테스트 운영용 제작 결과물(자막/영상) 등록

---

## 3. 검증 및 빌드 명령어

```bash
# 1. 자동 단위/통합 테스트 실행 (17개 테스트 통과)
npm test

# 2. TypeScript 타입 무결성 검사
npx tsc --noEmit

# 3. 프로덕션 최적화 빌드
npm run build
```

---

## 4. GitHub 및 Vercel 배포

상세한 배포 절차는 [docs/DEPLOYMENT.md](file:///c:/SEANIOR/docs/DEPLOYMENT.md)에 안내되어 있습니다.
- GitHub에 코드를 업로드할 때 `.env.local`은 자동으로 제외되어 비밀 키가 안전하게 보호됩니다.
- Vercel에 프로젝트를 연동하고 `Settings` → `Environment Variables`에 위 환경 변수 3가지를 추가하시면 즉시 전 세계에 배포됩니다.

