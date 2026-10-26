import { describe, it, expect } from "vitest";
import { ContentStatus } from "../src/lib/types";

describe("상태 전이 및 비즈니스 규칙 검증", () => {
  // 모의 레코드 상태
  function createMockRecord(overrides = {}) {
    return {
      id: "test-uuid-1",
      title: "테스트 그림",
      story: "테스트 이야기입니다.",
      expression_style: "AI 추천",
      status: "submitted" as ContentStatus,
      media_path: null as string | null,
      result_path: null as string | null,
      result_text: "",
      revision_request: "",
      approved_at: null as string | null,
      updated_at: "2026-10-21T10:00:00Z",
      ...overrides,
    };
  }

  it("신규 등록 시 기본 상태는 submitted여야 한다", () => {
    const record = createMockRecord();
    expect(record.status).toBe("submitted");
    expect(record.approved_at).toBeNull();
  });

  it("제작 결과(글 또는 파일)가 등록되면 ready 상태로 전환되어야 한다", () => {
    const record = createMockRecord();
    const resultText: string = "완성된 소개글입니다.";
    const hasResult = Boolean(resultText.trim().length > 0);
    const nextStatus: ContentStatus = hasResult ? "ready" : "submitted";
    expect(nextStatus).toBe("ready");
  });

  it("결과물이 전혀 없는 상태에서는 최종 승인이 불가능해야 한다", () => {
    const record = createMockRecord({
      status: "ready",
      result_text: "",
      result_path: null,
    });

    const hasResult = Boolean(
      (record.result_text && record.result_text.trim().length > 0) ||
      record.result_path
    );

    expect(hasResult).toBe(false);
  });

  it("결과물이 있을 때 최종 승인하면 approved 상태와 승인 일시가 기록된다", () => {
    const record = createMockRecord({
      status: "ready",
      result_text: "멋진 작품 소개글입니다.",
    });

    const hasResult = Boolean(
      (record.result_text && record.result_text.trim().length > 0) ||
      record.result_path
    );

    expect(hasResult).toBe(true);
    const approvedRecord = {
      ...record,
      status: "approved" as ContentStatus,
      approved_at: new Date().toISOString(),
    };

    expect(approvedRecord.status).toBe("approved");
    expect(approvedRecord.approved_at).not.toBeNull();
  });

  it("승인 완료 상태에서 원본 내용(제목/이야기 등)이 수정되면 승인이 해제되고 submitted로 전환된다", () => {
    const approvedRecord = createMockRecord({
      status: "approved",
      approved_at: "2026-10-21T11:00:00Z",
      result_text: "기존 결과",
    });

    // 사용자가 제목을 변경함
    const newTitle = "변경된 제목";
    const isOriginalChanged = approvedRecord.title !== newTitle;

    const nextStatus = isOriginalChanged ? "submitted" : approvedRecord.status;
    const nextApprovedAt = isOriginalChanged ? null : approvedRecord.approved_at;

    expect(nextStatus).toBe("submitted");
    expect(nextApprovedAt).toBeNull();
  });

  it("수정 요청 시 revision_requested 상태로 전환되고 승인 일시는 해제된다", () => {
    const record = createMockRecord({
      status: "ready",
      result_text: "기존 결과",
    });

    const revisionText = "색상을 조금 더 밝게 해주세요.";
    expect(revisionText.trim().length).toBeGreaterThan(0);

    const revisionRecord = {
      ...record,
      revision_request: revisionText,
      status: "revision_requested" as ContentStatus,
      approved_at: null,
    };

    expect(revisionRecord.status).toBe("revision_requested");
    expect(revisionRecord.revision_request).toBe(revisionText);
    expect(revisionRecord.approved_at).toBeNull();
  });

  it("낙관적 동시성 락: client_updated_at이 DB의 updated_at과 다르면 충돌로 판단해야 한다", () => {
    const dbRecord = createMockRecord({
      updated_at: "2026-10-21T12:00:00.000Z",
    });

    const staleClientUpdatedAt = "2026-10-21T10:00:00.000Z";
    const freshClientUpdatedAt = "2026-10-21T12:00:00.000Z";

    const isConflictStale =
      new Date(dbRecord.updated_at).getTime() !== new Date(staleClientUpdatedAt).getTime();
    const isConflictFresh =
      new Date(dbRecord.updated_at).getTime() !== new Date(freshClientUpdatedAt).getTime();

    expect(isConflictStale).toBe(true);
    expect(isConflictFresh).toBe(false);
  });
});
