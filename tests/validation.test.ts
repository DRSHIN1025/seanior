import { describe, it, expect } from "vitest";
import {
  contentRequestSchema,
  revisionRequestSchema,
  testResultSchema,
  verifyFileMagicBytes,
} from "../src/lib/validation";

describe("입력 유효성 검증 (Zod Schemas)", () => {
  it("정상적인 작품 정보는 유효성 검사를 통과해야 한다", () => {
    const validData = {
      title: "70세에 처음 그린 고향 풍경",
      story: "평생 트럭을 운전하다가 손주들의 응원으로 붓을 잡았습니다.",
      expression_style: "AI 추천",
    };
    const result = contentRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("빈 제목이나 공백만 있는 제목은 거부되어야 한다", () => {
    const invalidData = {
      title: "    ",
      story: "이야기 내용이 있습니다.",
      expression_style: "따뜻하게",
    };
    const result = contentRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("80자를 초과하는 제목은 거부되어야 한다", () => {
    const invalidData = {
      title: "a".repeat(81),
      story: "이야기 내용이 있습니다.",
      expression_style: "따뜻하게",
    };
    const result = contentRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("허용되지 않은 표현 스타일은 거부되어야 한다", () => {
    const invalidData = {
      title: "제목",
      story: "이야기",
      expression_style: "미확인 스타일",
    };
    const result = contentRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("수정 요청은 빈 내용일 수 없다", () => {
    const emptyRevision = { revision_request: "   " };
    const result = revisionRequestSchema.safeParse(emptyRevision);
    expect(result.success).toBe(false);

    const validRevision = { revision_request: "글씨를 조금 더 크게 키워주세요." };
    const validResult = revisionRequestSchema.safeParse(validRevision);
    expect(validResult.success).toBe(true);
  });
});

describe("서버 매직 바이트(Magic Bytes) 위조 검사", () => {
  it("올바른 JPEG 매직 바이트(FF D8 FF)를 인식해야 한다", () => {
    const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    expect(verifyFileMagicBytes(jpegBytes, "image/jpeg")).toBe(true);
    expect(verifyFileMagicBytes(jpegBytes, "image/png")).toBe(false);
  });

  it("올바른 PNG 매직 바이트(89 50 4E 47 0D 0A 1A 0A)를 인식해야 한다", () => {
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    expect(verifyFileMagicBytes(pngBytes, "image/png")).toBe(true);
    expect(verifyFileMagicBytes(pngBytes, "image/jpeg")).toBe(false);
  });

  it("올바른 WEBP 매직 바이트(RIFF ... WEBP)를 인식해야 한다", () => {
    const webpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x24, 0x00, 0x00, 0x00,
      0x57, 0x45, 0x42, 0x50, // WEBP
    ]);
    expect(verifyFileMagicBytes(webpBytes, "image/webp")).toBe(true);
  });

  it("올바른 MP4 매직 바이트(ftyp)를 인식해야 한다", () => {
    const mp4Bytes = new Uint8Array([
      0x00, 0x00, 0x00, 0x18,
      0x66, 0x74, 0x79, 0x70, // ftyp
      0x6d, 0x70, 0x34, 0x32,
    ]);
    expect(verifyFileMagicBytes(mp4Bytes, "video/mp4")).toBe(true);
  });

  it("HTML이나 SVG, 임의의 텍스트 파일이 이미지 MIME으로 위장한 경우 거부해야 한다", () => {
    const fakeFile = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>");
    expect(verifyFileMagicBytes(fakeFile, "image/png")).toBe(false);
    expect(verifyFileMagicBytes(fakeFile, "image/jpeg")).toBe(false);
  });
});
