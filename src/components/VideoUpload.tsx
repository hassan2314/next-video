"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { Video } from "lucide-react";
import { useRef, useState } from "react";

interface VideoUploadProps {
  onSuccess: (response: any) => void;
  onProgress?: (progress: number) => void;
  fileType: "video" | "image";
}
const VideoUpload = ({ onSuccess, onProgress, fileType }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Validation

  const ValidateFile = (file: File) => {
    if (fileType === "video") {
      if (file.type.startsWith("video/")) {
        setError("Please select a video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video size should be less than 100MB");
        return false;
      }
      if (file.size < 1 * 1024 * 1024) {
        setError("Video size should be greater than 1MB");
        return false;
      }
      return true;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ValidateFile(file)) return;

    setUploading(true);
    setError(null);
    try {
      const authRes = await fetch("api/auth/imagekit-auth");
      const auth = await authRes.json();

      const res = await upload({
        file: file,
        fileName: file.name,
        signature: auth.signature,
        publicKey: auth.publicKey,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          if (onProgress && event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(Math.round(progress));
          }
        },
      });
      onSuccess(res);
      setUploading(false);
    } catch (error) {
      if (error instanceof ImageKitUploadNetworkError) {
        setError("Network error");
      } else if (error instanceof ImageKitInvalidRequestError) {
        setError("Invalid request");
      } else if (error instanceof ImageKitServerError) {
        setError("Server error");
      } else if (error instanceof ImageKitAbortError) {
        setError("Upload aborted");
      } else {
        setError("Something went wrong");
      }
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p>{error}</p>}
    </>
  );
};

export default VideoUpload;
