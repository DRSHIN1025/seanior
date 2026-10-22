import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Upload,
  Mic,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Heart,
  Palette,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* 1. 히어로 섹션 */}
      <section className="w-full bg-linear-to-b from-white via-neutral-50 to-neutral-100/60 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-semibold text-neutral-800 shadow-2xs mb-6">
            <Sparkles className="h-4 w-4 text-neutral-900" />
            <span>시니어 창작자와 함께하는 SEA;NIOR</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.2]">
            당신의 재능은 <br className="hidden sm:inline" />
            <span className="underline decoration-neutral-400 underline-offset-8">
              아직 끝나지 않았습니다.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-neutral-600 font-normal leading-relaxed max-w-2xl mx-auto">
            어려운 영상 편집기를 배울 필요 없이, <br className="hidden sm:inline" />
            사진을 <strong className="text-neutral-900 font-bold">고르고</strong>, 이야기를 <strong className="text-neutral-900 font-bold">말하면</strong>, 멋진 콘텐츠로 만들어 드립니다.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto text-lg min-w-[220px]">
              <Link href="/works/new">
                <span>첫 작품 시작하기</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg min-w-[180px]">
              <Link href="/works">
                <span>제작 보관함 보기</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. 문제 인식 섹션 */}
      <section className="w-full py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              세상에 보여주고 싶은 작품은 있지만, <br />
              <span className="text-neutral-500">편집과 업로드의 벽에 부딪히셨나요?</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
              그림, 공예, 요리, 악기, 원예까지... 시니어의 삶 속에는 수많은 재능과 보물 같은 이야기가 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-900 mb-4 shadow-2xs font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                복잡한 편집기 사용의 어려움
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                자막 넣기, 음악 고르기, 화면 전환까지... 손에 익지 않은 스마트폰 앱은 창작의 즐거움을 가로막습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-900 mb-4 shadow-2xs font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                주변 도움의 한계
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                자녀나 지인에게 매번 편집을 부탁하기 미안해지고, 바쁜 일상으로 도움이 뜸해지면 창작 활동도 멈추게 됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-900 mb-4 shadow-2xs font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                세상과의 단절
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                혼자 간직하기에는 너무 아까운 작품들이 스마트폰 앨범 속에만 갇힌 채 세상과 소통할 기회를 잃어갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 창업 배경 이야기 */}
      <section className="w-full py-16 md:py-24 bg-neutral-100/60 border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-neutral-300 bg-white p-8 md:p-12 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-800 mb-4">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>창업자의 실제 이야기</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-6">
              73세 트럭 운전사 아버지의 그림에서 시작되었습니다
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-neutral-700 leading-relaxed">
              <p>
                창업자의 아버지는 평생 커다란 대형 트럭을 운전하셨습니다. 은퇴 후 정식 미술 교육을 한 번도 받은 적 없이, 73세의 나이에 처음으로 붓을 잡으셨습니다.
              </p>
              <p>
                자녀가 아버지의 그림과 거친 손의 작업 과정을 유튜브 ‘할배의 그림’ 채널에 올려드리자, 어느새 구독자가 200명을 넘고 따뜻한 응원의 댓글과 그림을 사고 싶다는 문의까지 생겼습니다. 아버지의 얼굴에는 오랜만에 설레는 미소가 피어올랐습니다.
              </p>
              <p>
                하지만 자녀가 바쁜 생업으로 영상 편집을 돕기 어려워지자, 아버지는 그림은 계속 그리셨지만 유튜브 업로드는 멈추고 말았습니다.
              </p>
              <blockquote className="my-6 border-l-4 border-neutral-900 pl-4 py-2 font-bold text-neutral-900 text-lg sm:text-xl bg-neutral-50 rounded-r-xl">
                “시니어에게 새로운 편집 도구를 배우라고 강요하기보다, <br />
                그저 사진을 고르고, 이야기하고, 결과만 확인하면 콘텐츠 활동이 지속될 수 없을까?”
              </blockquote>
              <p className="text-sm sm:text-base text-neutral-500">
                * 이 사례는 창업자의 개인적 경험이며, SEA;NIOR는 시니어의 창작이 멈추지 않는 세상을 만들기 위해 탄생했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 해결 방식: 고르GO · 말하GO · 확인하GO */}
      <section className="w-full py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900">
              세 단계면 충분합니다
            </h2>
            <p className="mt-3 text-lg text-neutral-600">
              복잡한 프로그램 없이, 말 한마디와 사진 한 장으로 시작하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1단계 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-md mb-6">
                <Upload className="h-8 w-8" />
              </div>
              <div className="inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-bold text-neutral-800 mb-2">
                1단계
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                고르GO
              </h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                스마트폰 앨범에서 세상에 보여주고 싶은 사진이나 영상을 골라 등록합니다.
              </p>
            </div>

            {/* 2단계 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-md mb-6">
                <Mic className="h-8 w-8" />
              </div>
              <div className="inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-bold text-neutral-800 mb-2">
                2단계
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                말하GO
              </h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                작품을 만들 때의 마음과 사연을 음성이나 글로 편안하게 들려줍니다.
              </p>
            </div>

            {/* 3단계 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-md mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div className="inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-bold text-neutral-800 mb-2">
                3단계
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                확인하GO
              </h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                완성된 콘텐츠 초안을 확인하고, 마음에 들면 승인하거나 수정을 요청합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 서비스 투명성 및 로드맵 안내 */}
      <section className="w-full py-16 md:py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-10 shadow-xs">
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-neutral-900" />
              <span>현재 체험 가능한 기능과 준비 중인 기능</span>
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              SEA;NIOR는 솔직하고 투명하게 서비스를 검증해 나가고 있습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                <h4 className="text-base font-bold text-emerald-950 mb-3 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">✓</span>
                  현재 바로 체험 가능한 기능
                </h4>
                <ul className="text-sm text-emerald-900 space-y-2 leading-relaxed">
                  <li>• 작품 사진/영상 선택 및 고유 스토리지 업로드</li>
                  <li>• 음성 인식(STT) 또는 텍스트 입력으로 이야기 전달</li>
                  <li>• 5가지 감성 표현 방식(AI 추천, 감동, 따뜻, 전시, SNS) 선택</li>
                  <li>• 제작 건 목록 보관함 및 상태별 확인 (페이지네이션)</li>
                  <li>• 테스트용 결과물 등록, 1:1 수정 요청 및 최종 승인 절차</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-100/60 p-5">
                <h4 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-400 text-white text-xs">i</span>
                  향후 고도화 예정 기능 (후속 개발)
                </h4>
                <ul className="text-sm text-neutral-700 space-y-2 leading-relaxed">
                  <li>• AI 자동 숏폼 영상 생성 및 음악/효과음 합성 API</li>
                  <li>• 유튜브 쇼츠, 인스타그램 릴스 등 외부 SNS 원클릭 자동 게시</li>
                  <li>• 시니어 개인별 로그인 및 비공개 권한(RLS) 관리</li>
                  <li>• 버전별 수정 이력 및 전문 에디터 컨시어지 연동</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 마지막 CTA */}
      <section className="w-full py-16 md:py-24 bg-white text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
            세상에 보여주고 싶은 당신만의 작품, <br />
            지금 바로 시작해 보세요
          </h2>
          <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
            비용 없이 편안하게 첫 번째 이야기를 남기실 수 있습니다.
          </p>

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="text-xl px-10 h-16 min-h-[64px] rounded-2xl shadow-md">
              <Link href="/works/new">
                <span>첫 작품 시작하기</span>
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

