"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useState } from "react";

interface VideoUploadProps {
  onSuccess: (response: any) => void;
  onProgress?: (progress: number) => void;
  fileType: "video" | "image";
}

const VideoUpload = ({ onSuccess, onProgress, fileType }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Validation
  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file");
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
    }

    if (fileType === "image") {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return false;
      }
    }

    return true;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);
    try {
      const authRes = await fetch("/api/auth/imagekit-auth"); // ✅ fixed missing "/"
      const auth = await authRes.json();

      const res = await upload({
        file: file,
        fileName: file.name,
        signature: auth.authenticationParameters.signature,
        publicKey: auth.publicKey,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
        onProgress: (event) => {
          if (onProgress && event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(Math.round(progress));
          }
        },
      });
      onSuccess(res);
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
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full border p-3  text-gray-800 rounded-lg focus:ring focus:ring-blue-300 mt-1"
      />
      {uploading && <p className="text-sm text-gray-800 ">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default VideoUpload;
