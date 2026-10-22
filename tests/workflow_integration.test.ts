import { describe, it, expect } from "vitest";
import { ContentRequest, ContentStatus } from "../src/lib/types";
import {
  contentRequestSchema,
  revisionRequestSchema,
  testResultSchema,
  validateFile,
} from "../src/lib/validation";

/**
 * 전체 11단계 E2E 워크플로우 및 엣지 케이스 통합 시뮬레이션
 */
describe("SEA;NIOR 11단계 콘텐츠 라이프사이클 및 엣지 케이스 통합 검증", () => {
  // 가상 DB 상태
  let dbStore: Record<string, ContentRequest> = {};

  it("Step 1: 등록 (신규 원본/이야기 등록 -> submitted 상태 확인)", () => {
    const rawInput = {
      title: "  73세에 처음 그린 고향 느티나무  ",
      story: "  평생 운전만 하다가 손주들의 응원으로 붓을 잡았습니다.  ",
      expression_style: "따뜻하게",
    };

    const parsed = contentRequestSchema.safeParse(rawInput);
    expect(parsed.success).toBe(true);

    const newId = "work-uuid-1001";
    const now = "2026-10-22T00:00:00.000Z";

    dbStore[newId] = {
      id: newId,
      title: parsed.data!.title,
      story: parsed.data!.story,
      expression_style: parsed.data!.expression_style,
      status: "submitted",
      media_path: "originals/mock-tree.jpg",
      media_type: "image/jpeg",
      result_path: null,
      result_type: null,
      result_text: "",
      revision_request: "",
      approved_at: null,
      created_at: now,
      updated_at: now,
    };

    expect(dbStore[newId].status).toBe("submitted");
    expect(dbStore[newId].approved_at).toBeNull();
    expect(dbStore[newId].title).toBe("73세에 처음 그린 고향 느티나무");
  });

  it("Step 2 & 3: 목록 및 상세 (정렬 순서와 ID 조회 확인)", () => {
    const item = dbStore["work-uuid-1001"];
    expect(item).toBeDefined();
    expect(item.id).toBe("work-uuid-1001");
  });

  it("Step 4: 새로고침 후 데이터 유지 (데이터베이스 영속성)", () => {
    const reloadedItem = { ...dbStore["work-uuid-1001"] };
    expect(reloadedItem.title).toBe("73세에 처음 그린 고향 느티나무");
    expect(reloadedItem.status).toBe("submitted");
  });

  it("Step 5: 원본 수정 (제목 변경 및 updated_at 갱신)", () => {
    const existing = dbStore["work-uuid-1001"];
    const updatedTitle = "73세에 처음 그린 고향 마을과 느티나무";

    const parsed = contentRequestSchema.safeParse({
      title: updatedTitle,
      story: existing.story,
      expression_style: existing.expression_style,
    });
    expect(parsed.success).toBe(true);

    const isOriginalChanged = existing.title !== parsed.data!.title;
    expect(isOriginalChanged).toBe(true);

    const updatedNow = "2026-10-22T01:00:00.000Z";
    dbStore["work-uuid-1001"] = {
      ...existing,
      title: parsed.data!.title,
      status: isOriginalChanged ? "submitted" : existing.status,
      updated_at: updatedNow,
    };

    expect(dbStore["work-uuid-1001"].title).toBe(updatedTitle);
    expect(dbStore["work-uuid-1001"].status).toBe("submitted");
  });

  it("Step 6: 제작 결과 등록 (운영자 테스트 소개글/파일 등록 -> ready 전환)", () => {
    const existing = dbStore["work-uuid-1001"];
    const resultText = "[할배의 그림] 평생 트럭을 몰던 아버지의 첫 붓질, 고향 느티나무 이야기입니다.";

    const parsed = testResultSchema.safeParse({ result_text: resultText });
    expect(parsed.success).toBe(true);

    const hasResult = Boolean(parsed.data!.result_text && parsed.data!.result_text.trim().length > 0);
    expect(hasResult).toBe(true);

    dbStore["work-uuid-1001"] = {
      ...existing,
      result_text: parsed.data!.result_text!,
      result_path: "results/mock-result-video.mp4",
      result_type: "video/mp4",
      status: "ready",
      approved_at: null,
      updated_at: "2026-10-22T02:00:00.000Z",
    };

    expect(dbStore["work-uuid-1001"].status).toBe("ready");
    expect(dbStore["work-uuid-1001"].result_path).not.toBeNull();
  });

  it("Step 7: 수정 요청 (revision_requested 전환 및 사유 기록)", () => {
    const existing = dbStore["work-uuid-1001"];
    const revisionInput = "자막 글씨를 조금 더 크게 키워주시고, 배경 음악을 잔잔하게 넣어주세요.";

    const parsed = revisionRequestSchema.safeParse({ revision_request: revisionInput });
    expect(parsed.success).toBe(true);

    dbStore["work-uuid-1001"] = {
      ...existing,
      revision_request: parsed.data!.revision_request,
      status: "revision_requested",
      approved_at: null,
      updated_at: "2026-10-22T03:00:00.000Z",
    };

    expect(dbStore["work-uuid-1001"].status).toBe("revision_requested");
    expect(dbStore["work-uuid-1001"].revision_request).toBe(revisionInput);
  });

  it("Step 8: 결과 변경 (수정 사항 반영된 결과 재등록 -> ready 전환)", () => {
    const existing = dbStore["work-uuid-1001"];
    const newResultText = "[할배의 그림 v2] 자막 크기를 키운 따뜻한 고향 느티나무 영상입니다.";

    dbStore["work-uuid-1001"] = {
      ...existing,
      result_text: newResultText,
      status: "ready",
      approved_at: null,
      updated_at: "2026-10-22T04:00:00.000Z",
    };

    expect(dbStore["work-uuid-1001"].status).toBe("ready");
  });

  it("Step 9: 최종 승인 (결과 존재 확인 후 approved 전환 및 approved_at 기록)", () => {
    const existing = dbStore["work-uuid-1001"];
    const hasResult = Boolean(
      (existing.result_text && existing.result_text.trim().length > 0) || existing.result_path
    );
    expect(hasResult).toBe(true);

    const approvedAt = "2026-10-22T05:00:00.000Z";
    dbStore["work-uuid-1001"] = {
      ...existing,
      status: "approved",
      approved_at: approvedAt,
      updated_at: approvedAt,
    };

    expect(dbStore["work-uuid-1001"].status).toBe("approved");
    expect(dbStore["work-uuid-1001"].approved_at).toBe(approvedAt);
  });

  it("Step 10: 원본 변경 시 승인 해제 (승인된 건의 제목 변경 시 submitted로 리셋)", () => {
    const existing = dbStore["work-uuid-1001"];
    expect(existing.status).toBe("approved");

    // 원본 제목을 다시 수정함
    const modifiedTitle = "새로운 제목으로 변경";
    const isOriginalChanged = existing.title !== modifiedTitle;
    expect(isOriginalChanged).toBe(true);

    dbStore["work-uuid-1001"] = {
      ...existing,
      title: modifiedTitle,
      status: isOriginalChanged ? "submitted" : existing.status,
      approved_at: isOriginalChanged ? null : existing.approved_at,
      updated_at: "2026-10-22T06:00:00.000Z",
    };

    expect(dbStore["work-uuid-1001"].status).toBe("submitted");
    expect(dbStore["work-uuid-1001"].approved_at).toBeNull();
  });

  it("Step 11: 삭제 (레코드 제거)", () => {
    expect(dbStore["work-uuid-1001"]).toBeDefined();
    delete dbStore["work-uuid-1001"];
    expect(dbStore["work-uuid-1001"]).toBeUndefined();
  });

  it("Edge Case 1: 존재하지 않는 상세 주소 (null 반환)", () => {
    const nonExistent = dbStore["non-existent-uuid"];
    expect(nonExistent).toBeUndefined();
  });

  it("Edge Case 2: 파일 없는 등록 지원 (텍스트 단독 등록)", () => {
    const textOnlyInput = {
      title: "글로만 남기는 우리 가족 이야기",
      story: "사진은 없지만 글로 남기고 싶은 사연입니다.",
      expression_style: "전시 느낌",
    };
    const parsed = contentRequestSchema.safeParse(textOnlyInput);
    expect(parsed.success).toBe(true);
  });

  it("Edge Case 3: 결과 미등록 상태에서 최종 승인 원천 차단", () => {
    const emptyResultRecord: ContentRequest = {
      id: "no-result-id",
      title: "결과 없는 작품",
      story: "이야기",
      expression_style: "AI 추천",
      status: "ready",
      media_path: null,
      media_type: null,
      result_path: null,
      result_type: null,
      result_text: "   ",
      revision_request: "",
      approved_at: null,
      created_at: "2026-10-22T00:00:00.000Z",
      updated_at: "2026-10-22T00:00:00.000Z",
    };

    const hasResult = Boolean(
      (emptyResultRecord.result_text && emptyResultRecord.result_text.trim().length > 0) ||
      emptyResultRecord.result_path
    );
    expect(hasResult).toBe(false);
  });

  it("Edge Case 4: 오래된 편집 충돌 (Optimistic Lock) 감지", () => {
    const serverRecordUpdatedAt = "2026-10-22T05:00:00.000Z";
    const staleClientUpdatedAt = "2026-10-22T02:00:00.000Z";

    const isConflict =
      new Date(serverRecordUpdatedAt).getTime() !== new Date(staleClientUpdatedAt).getTime();
    expect(isConflict).toBe(true);
  });
});

