export interface UploadResponse {
  fileId?: string; // ✅ now optional, matches lib
  name: string;
  size: number;
  filePath: string;
  url: string;
  thumbnailUrl?: string;
  height?: number;
  width?: number;
  fileType: "image" | "non-image" | "video";
  [key: string]: unknown;
}
