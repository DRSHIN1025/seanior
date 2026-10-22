import { z } from "zod";
import { EXPRESSION_STYLES } from "./types";

export const MAX_TOTAL_FILE_SIZE = 3 * 1024 * 1024; // 3MB
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
] as const;

export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];

export const contentRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "작품 제목을 입력해 주세요.")
    .max(80, "작품 제목은 최대 80자까지 입력할 수 있습니다."),
  story: z
    .string()
    .trim()
    .min(1, "작품에 담긴 이야기나 추억을 들려주세요.")
    .max(2000, "이야기는 최대 2,000자까지 입력할 수 있습니다."),
  expression_style: z.enum(EXPRESSION_STYLES, {
    errorMap: () => ({ message: "원하시는 표현 방식을 선택해 주세요." }),
  }),
});

export const revisionRequestSchema = z.object({
  revision_request: z
    .string()
    .trim()
    .min(1, "수정하고 싶은 내용을 구체적으로 입력해 주세요.")
    .max(1000, "수정 요청은 최대 1,000자까지 입력할 수 있습니다."),
});

export const testResultSchema = z.object({
  result_text: z
    .string()
    .max(4000, "제작 결과 소개글은 최대 4,000자까지 입력할 수 있습니다.")
    .optional()
    .default(""),
});

/**
 * 서버 측 매직 바이트(Magic Numbers) 검사
 * 위조된 MIME 타입이나 확장자(예: SVG, HTML을 PNG로 속인 경우)를 차단합니다.
 */
export function verifyFileMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // WEBP: RIFF .... WEBP (0-3: 'RIFF', 8-11: 'WEBP')
  if (mimeType === "image/webp") {
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  // MP4: 4-7 bytes are 'ftyp' (0x66, 0x74, 0x79, 0x70)
  if (mimeType === "video/mp4") {
    return (
      buffer[4] === 0x66 &&
      buffer[5] === 0x74 &&
      buffer[6] === 0x79 &&
      buffer[7] === 0x70
    );
  }

  return false;
}

/**
 * 파일 유효성 검사 (크기, MIME 타입, 매직 바이트)
 */
export async function validateFile(
  file: File | null
): Promise<{ valid: boolean; error?: string }> {
  if (!file || file.size === 0) {
    return { valid: true };
  }

  if (file.size > MAX_TOTAL_FILE_SIZE) {
    return {
      valid: false,
      error: `파일 크기는 최대 ${MAX_TOTAL_FILE_SIZE / (1024 * 1024)}MB까지 등록 가능합니다.`,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    return {
      valid: false,
      error: "JPG, PNG, WEBP 이미지 또는 MP4 영상 파일만 업로드할 수 있습니다.",
    };
  }

  // 매직 바이트 확인
  try {
    const arrayBuffer = await file.slice(0, 32).arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const matches = verifyFileMagicBytes(bytes, file.type);
    if (!matches) {
      return {
        valid: false,
        error: "파일 형식이 올바르지 않거나 손상된 파일입니다.",
      };
    }
  } catch (err) {
    return {
      valid: false,
      error: "파일을 검사하는 중 오류가 발생했습니다.",
    };
  }

  return { valid: true };
}
