# SEA;NIOR 배포 가이드 (DEPLOYMENT)

이 문서는 초보 개발자도 쉽게 GitHub에 프로젝트를 올리고, Supabase 데이터베이스를 구축하며, Vercel을 통해 무료로 전 세계에 웹 서비스를 배포할 수 있도록 작성되었습니다.

---

## 1. 사전 체크: 비밀 키 및 Git 무결성 확인
프로젝트의 `.gitignore` 파일에는 `.env*.local` 및 `.env` 파일이 기본 등록되어 있습니다.
GitHub에 코드를 올리기 전, 절대 비밀 키가 커밋되지 않도록 확인합니다.

```bash
# 로컬 변경 사항 확인 (.env.local이 목록에 없어야 함)
git status
```

---

## 2. Supabase 데이터베이스 구축 (5분 소요)

1. [Supabase 공식 홈페이지](https://supabase.com)에 로그인 후 **New project**를 생성합니다.
2. 프로젝트 대시보드 좌측 메뉴의 **SQL Editor**로 이동합니다.
3. 이 저장소의 `supabase/schema.sql` 파일 전체 내용을 복사하여 SQL Editor에 붙여넣고 **Run**을 누릅니다.
   - `content_requests` 테이블이 생성됩니다.
   - 3MB 파일 크기 및 길이 제약 조건, 자동 시간 갱신 트리거가 설정됩니다.
   - `seanior-media` 비공개 Storage 버킷이 생성됩니다.
4. 좌측 메뉴의 **Project Settings** $\rightarrow$ **API**로 이동하여 다음 두 가지 값을 확인합니다:
   - **Project URL** (예: `https://xyzcompany.supabase.co`)
   - **service_role secret** (주의: `anon` 키가 아닌 `service_role` 키를 확인합니다)

---

## 3. GitHub 저장소 생성 및 푸시

1. [GitHub](https://github.com)에 로그인하여 새 저장소(New Repository)를 생성합니다 (예: `seanior-app`).
2. 터미널에서 다음 명령어를 실행하여 코드를 업로드합니다:

```bash
git init
git add .
git commit -m "feat: SEA;NIOR 시니어 창작 콘텐츠 서비스 1차 구현 완료"
git branch -M main
git remote add origin https://github.com/사용자아이디/seanior-app.git
git push -u origin main
```

---

## 4. Vercel 배포 (3분 소요)

1. [Vercel](https://vercel.com)에 로그인하고 **Add New...** $\rightarrow$ **Project**를 선택합니다.
2. 방금 올린 GitHub 저장소(`seanior-app`)를 찾아 **Import**를 누릅니다.
3. **Environment Variables** (환경 변수) 섹션을 펼치고, 아래 3개 변수를 입력합니다:
   - `SUPABASE_URL`: 2단계에서 확인한 Project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: 2단계에서 확인한 service_role 비밀키
   - `SUPABASE_STORAGE_BUCKET`: `seanior-media`
4. **Deploy** 버튼을 누릅니다.
5. 약 1분 후 빌드가 완료되고 나만의 서비스 주소(예: `https://seanior-app.vercel.app`)가 생성됩니다!

---

## 5. 배포 후 최종 검증 단계

1. 배포된 Vercel URL에 접속하여 메인 랜딩 페이지가 정상 표시되는지 확인합니다.
2. **첫 작품 시작하기**(`/works/new`)를 눌러 사진이나 사연을 등록해 봅니다.
3. 제작 보관함(`/works`) 및 상세 화면(`/works/[id]`)에서 정상적으로 저장되었는지 확인합니다.
4. 수정 화면(`/works/[id]/edit`)에서 테스트 결과물을 등록해 보고 상태가 `ready`로 전환되는지 확인합니다.
5. 상세 화면에서 확인 체크 후 **최종 승인**을 완료해 봅니다.

