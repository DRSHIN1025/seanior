"use client";

import * as React from "react";
import {
  Sparkles,
  ArrowRight,
  Upload,
  Mic,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Heart,
  Palette,
  Layers,
  PhoneCall,
  Clock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  // 3단계 UX 인터랙티브 탭 상태
  const [activeStep, setActiveStep] = React.useState<number>(1);

  // FAQ 아코디언 토글 상태 (다중 열림 지원)
  const [openFaqIndices, setOpenFaqIndices] = React.useState<Record<number, boolean>>({
    0: true, // 첫 번째 질문 기본 열림
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const stepsData = [
    {
      step: 1,
      name: "고르GO",
      subtitle: "보여주고 싶은 작품 고르기",
      icon: Upload,
      tag: "최대 3MB 파일 지원",
      desc: "스마트폰 앨범에 있는 그림, 서예, 공예품, 텃밭, 요리 사진이나 짧은 영상을 손가락으로 콕 찍어 골라주세요.",
      previewTitle: "고르GO 화면 미리보기",
      previewItems: [
        "스마트폰 앨범에서 사진/영상 간편 선택",
        "JPG, PNG, WEBP 사진 및 MP4 영상 지원",
        "잘못 골라도 언제든 다시 고르기 가능",
      ],
      tip: "💡 전문적인 카메라가 아니어도 괜찮습니다. 스마트폰으로 찍은 사진이면 충분합니다.",
    },
    {
      step: 2,
      name: "말하GO",
      subtitle: "마음에 담긴 사연 들려주기",
      icon: Mic,
      tag: "음성 인식(STT) 지원",
      desc: "작품을 만들게 된 계기, 손주나 가족에게 전하고 싶은 마음을 말씀해 주세요. 말로 하셔도 되고, 글자로 적으셔도 됩니다.",
      previewTitle: "말하GO 화면 미리보기",
      previewItems: [
        "마이크 버튼 누르고 편안하게 말하기 (한국어 음성 인식)",
        "5가지 분위기 스타일 선택 (따뜻하게, 감동적으로, 전시 느낌 등)",
        "작품 제목과 추억 사연 직접 편집 가능",
      ],
      tip: "💡 타자를 빠르게 칠 필요 없습니다. '말로 들려주기'를 누르면 목소리가 글자로 바뀝니다.",
    },
    {
      step: 3,
      name: "확인하GO",
      subtitle: "완성된 초안 검토 및 승인",
      icon: CheckCircle,
      tag: "1:1 수정 요청 및 최종 승인",
      desc: "정성껏 다듬은 자막과 이야기 초안을 편안하게 읽어보세요. 마음에 들 때까지 고쳐드리고, 마음에 쏙 들 때 최종 승인합니다.",
      previewTitle: "확인하GO 화면 미리보기",
      previewItems: [
        "제작된 카드뉴스·자막 대본 한눈에 확인",
        "마음에 안 드는 부분은 구체적으로 수정 요청",
        "시니어 님이 직접 '승인' 버튼을 눌러야 완성 확정",
      ],
      tip: "💡 승인하기 전까지는 외부에 공유되지 않으니 안심하고 꼼꼼히 확인하세요.",
    },
  ];

  const faqs = [
    {
      q: "컴퓨터나 스마트폰을 잘 다루지 못하는데 혼자 할 수 있나요?",
      a: "네, बिल्कुल 가능합니다! SEA;NIOR는 61~74세 시니어 사용자를 위해 복잡한 편집 메뉴를 모두 없앴습니다. 카카오톡에서 사진 보내듯 사진을 고르고, 목소리로 이야기하면 글자로 적힙니다. 큰 글씨와 큼직한 56px 버튼으로 눈이 침침해도 편안하게 이용하실 수 있습니다.",
    },
    {
      q: "비용이 청구되거나 자동으로 결제되나요?",
      a: "아닙니다. 현재 공개된 버전은 서비스 효용성과 사용자 경험을 검증하기 위한 데모 환경이며, 일체의 비용 청구나 유료 결제 연동이 없습니다. 추후 정식 서비스 도입 시에도 사전에 투명하게 안내해 드립니다.",
    },
    {
      q: "승인하면 내 사진과 사연이 바로 인터넷(유튜브/인스타그램)에 공개되나요?",
      a: "아닙니다. 본 MVP는 시니어 님이 제작 결과를 꼼꼼히 검토하고 '최종 승인'하는 안전한 검토 프로세스까지를 지원합니다. 외부 SNS 직접 자동 게시는 후속 개발 단계로, 시니어 님의 별도 동의와 연동 없이는 외부로 자동 게시되지 않습니다.",
    },
    {
      q: "음성 인식이 잘 안 되면 어떡하나요?",
      a: "주변이 시끄럽거나 마이크 사용이 어려우실 경우 언제든지 키보드로 직접 글자를 입력하거나 수정하실 수 있습니다. 자녀나 보호자 분이 대신 받아 적어 주셔도 좋습니다.",
    },
    {
      q: "사진을 올렸는데 크기가 너무 크면 어떻게 하나요?",
      a: "3MB 이하의 사진이나 영상을 지원합니다. 스마트폰 기본 카메라로 촬영된 대부분의 일반 사진은 즉시 등록 가능하며, 파일 크기가 초과될 경우 알기 쉬운 한국어 안내 메시지가 나타납니다.",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* 1. 히어로 섹션 */}
      <section
        id="service-intro"
        className="w-full bg-linear-to-b from-white via-neutral-50 to-neutral-100/60 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-neutral-200"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm font-semibold text-neutral-800 shadow-2xs mb-6">
            <Sparkles className="h-4 w-4 text-neutral-900" />
            <span>시니어 창작자를 위한 SEA;NIOR</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.2]">
            당신의 재능은 <br className="hidden sm:inline" />
            <span className="underline decoration-neutral-400 underline-offset-8">
              아직 끝나지 않았습니다.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-neutral-600 font-normal leading-relaxed max-w-2xl mx-auto">
            어려운 영상 편집기를 배울 필요 없이, <br className="hidden sm:inline" />
            사진을 <strong className="text-neutral-900 font-bold">고르고</strong>, 이야기를{" "}
            <strong className="text-neutral-900 font-bold">말하면</strong>, 세상과 연결되는 콘텐츠가 됩니다.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto text-lg min-w-[220px] min-h-[56px]">
              <a href="#process">
                <span>3단계 과정 둘러보기</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg min-w-[180px] min-h-[56px]"
            >
              <a href="#story">
                <span>창업 스토리 읽기</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. 창업 스토리 및 문제 인식 섹션 */}
      <section id="story" className="w-full py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-extrabold text-neutral-500 uppercase tracking-widest">
              진정성 있는 시작
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 mt-2">
              73세에 처음 붓을 잡은 <br className="sm:hidden" />
              아버지의 이야기
            </h2>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 md:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4 text-base md:text-lg text-neutral-700 leading-relaxed">
                <p>
                  평생 대형 화물트럭을 운전하시던 아버지는 은퇴 후 73세가 되던 해에 처음으로 유화 물감을 손에 쥐셨습니다.
                  거친 손으로 고향 풍경을 캔버스에 담아내셨을 때, 온 가족이 감탄했습니다.
                </p>
                <p>
                  자녀의 도움으로 유튜브 채널 <strong className="text-neutral-900">‘할배의 그림’</strong>에 영상을 올렸을 때,
                  200명이 넘는 구독자와 따뜻한 응원 댓글, 그림을 사고 싶다는 문의가 쏟아졌습니다. 아버지는 다시 살아갈 커다란 활력을 얻으셨습니다.
                </p>
                <div className="rounded-2xl border-l-4 border-neutral-900 bg-white p-5 shadow-2xs">
                  <p className="font-bold text-neutral-900 text-lg md:text-xl">
                    “하지만 자녀가 바빠져 편집을 돕지 못하자, 업로드는 멈추었습니다.”
                  </p>
                  <p className="text-sm md:text-base text-neutral-500 mt-1">
                    시니어에게 복잡한 영상 편집기를 가르치는 것은 정답이 아니었습니다.
                  </p>
                </div>
                <p>
                  <strong className="text-neutral-900">SEA;NIOR</strong>는 바로 이 질문에서 출발했습니다.
                  “시니어가 복잡한 도구를 배울 필요 없이, 선택하고 이야기하고 확인만 하면 콘텐츠 활동을 지속하게 할 수는 없을까?”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3단계 핵심 솔루션 인터랙티브 섹션 */}
      <section id="process" className="w-full py-16 md:py-24 bg-neutral-100/60 border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-sm font-extrabold text-neutral-500 uppercase tracking-widest">
              간단하고 명쾌한 3-Step UX
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 mt-2">
              고르GO, 말하GO, 확인하GO
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 mt-3">
              시니어 님이 복잡한 기계 조작에 지치지 않도록, 세 걸음의 멘탈 모델로 완성했습니다.
              아래 단계를 눌러 직접 확인해 보세요.
            </p>
          </div>

          {/* 단계 선택 인터랙티브 탭 버튼 (56px 시니어 터치 친화) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stepsData.map((s) => {
              const isCurrent = activeStep === s.step;
              const StepIcon = s.icon;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(s.step)}
                  className={`flex min-h-[72px] items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                    isCurrent
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-md scale-[1.02]"
                      : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500 hover:bg-neutral-50"
                  }`}
                  aria-pressed={isCurrent}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black text-lg ${
                      isCurrent ? "bg-white text-neutral-900" : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div className="text-lg font-extrabold">{s.name}</div>
                    <div className={`text-xs ${isCurrent ? "text-neutral-300" : "text-neutral-500"}`}>
                      {s.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 활성화된 단계 상세 카드 */}
          {stepsData
            .filter((s) => s.step === activeStep)
            .map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-10 shadow-xs transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-neutral-900 px-3 py-1 text-xs font-bold text-white">
                          STEP 0{item.step}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                          {item.tag}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2">
                        <Icon className="h-7 w-7 text-neutral-900" />
                        <span>
                          {item.step}단계 : {item.name}
                        </span>
                      </h3>

                      <p className="text-lg text-neutral-700 leading-relaxed">{item.desc}</p>

                      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 font-medium">
                        {item.tip}
                      </div>
                    </div>

                    {/* 인터랙티브 미리보기 박스 */}
                    <div className="w-full lg:w-96 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-2xs">
                      <div className="flex items-center gap-2 text-sm font-bold text-neutral-800 pb-3 border-b border-neutral-200">
                        <Eye className="h-4 w-4 text-neutral-600" />
                        <span>{item.previewTitle}</span>
                      </div>

                      <ul className="mt-4 space-y-3">
                        {item.previewItems.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5 text-sm text-neutral-700 font-medium">
                            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 4. 시니어 안심 약속 섹션 */}
      <section id="promise" className="w-full py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-extrabold text-neutral-500 uppercase tracking-widest">
              안전과 신뢰
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 mt-2">
              시니어 님을 위한 안심 약속
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xs border border-neutral-200 text-neutral-900 mb-4">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">승인 전 미공개 원칙</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                만들어진 결과물은 시니어 님이 직접 두 눈으로 확인하고 승인하기 전까지 절대 외부에 공개되지 않습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xs border border-neutral-200 text-neutral-900 mb-4">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">무제한 수정 지원</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                글자 크기나 문구, 분위기가 마음에 들지 않으면 언제든 1:1로 수정을 요청하실 수 있습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xs border border-neutral-200 text-neutral-900 mb-4">
                <Palette className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">56px 시니어 터치 규격</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                작은 글씨와 복잡한 아이콘 대신, 손가락 터치가 빗나가지 않는 고대비 대형 버튼을 적용했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 자주 묻는 질문(FAQ) 인터랙티브 아코디언 섹션 */}
      <section id="faq" className="w-full py-16 md:py-24 bg-neutral-100/60 border-b border-neutral-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-extrabold text-neutral-500 uppercase tracking-widest">
              궁금한 점 해결
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 mt-2">
              자주 묻는 질문
            </h2>
            <p className="text-base text-neutral-600 mt-2">
              궁금하신 점을 누르면 상세한 답변이 펼쳐집니다.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = Boolean(openFaqIndices[idx]);
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full min-h-[64px] items-center justify-between p-5 md:p-6 text-left transition hover:bg-neutral-50"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base md:text-lg font-bold text-neutral-900 pr-4">
                      {faq.q}
                    </span>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-neutral-900 text-white" : ""
                      }`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 md:px-6 md:pb-6 text-base text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50 animate-in fade-in-50 duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. 최종 액션 하단 배너 */}
      <section className="w-full py-16 md:py-20 bg-neutral-950 text-white text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            지금, 당신의 소중한 작품과 이야기를 <br className="hidden sm:inline" />
            세상에 들려주세요.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
            사진 한 장과 짧은 사연이면 충분합니다. <br className="sm:hidden" />
            복잡한 편집의 벽을 넘어 따스한 소통을 시작해 보세요.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-neutral-950 hover:bg-neutral-100 text-lg min-w-[220px] min-h-[56px] shadow-lg font-extrabold"
            >
              <a href="#process">
                <span>3단계 과정 바로보기</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
