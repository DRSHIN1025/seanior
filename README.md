# SEA;NIOR (시니어 창작 콘텐츠 서비스)

> **시니어의 소중한 경험과 재능(그림, 공예, 요리, 악기 등)을 콘텐츠로 만들어 세상과 연결하고 지속적인 창작 활동을 지원하는 서비스**

본 저장소는 **SEA;NIOR** 프로젝트의 단계별 과제 제출 및 검토를 위한 저장소입니다.

---

## 📌 과제 제출 브랜치 및 PR 구조

본 저장소는 과제 검토자가 각 미션의 실제 코드 차이(diff)를 명확히 검토할 수 있도록 **스택형 PR(Stacked Pull Requests)** 구조로 구성되어 있습니다.

```
main (기준 안내 브랜치)
  └── mission-5 (PR #1: [신득렬]-미션5 - 독립 실행형 시니어 랜딩 페이지)
        └── mission-6 (PR #2: [신득렬]-미션6 - 완성 MVP 전체 / DB·스토리지·라이프사이클·배포)
```

| 브랜치명 | PR 제목 | 검토 대상 및 범위 | Vercel 배포 여부 |
| :--- | :--- | :--- | :---: |
| **`main`** | - | 제출 저장소 안내 기준 브랜치 | X (배포 대상 아님) |
| **`mission-5`** | `[신득렬]-미션5` | 시니어 맞춤 랜딩 페이지, 반응형 레이아웃, 공통 UI/디자인 시스템, 독립 실행 가능 | X |
| **`mission-6`** | `[신득렬]-미션6` | **최종 완성본 MVP 전체**: Supabase Postgres DB, Storage 연동, 4단계 라이프사이클 상태 전이, E2E 검증 | **O (실제 프로덕션 배포 대상)** |

---

## 🛠 기술 스택

- **Framework**: Next.js 16.4.2 (App Router & Turbopack), React 19.3.1
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui pattern with Radix UI Primitives
- **Database & Storage**: Supabase Postgres & Supabase Storage (미션 6)
- **Validation**: Zod & 파일 매직 바이트 검증 (미션 6)
- **Testing**: Vitest & Browser E2E Verification (미션 6)

---

## 👨‍💻 작성자 정보

- **제출자**: 신득렬
- **저장소**: [https://github.com/DRSHIN1025/seanior](https://github.com/DRSHIN1025/seanior)
