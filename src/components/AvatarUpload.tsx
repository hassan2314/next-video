"use client";

import {
  upload,
  ImageKitUploadNetworkError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitAbortError,
} from "@imagekit/next";
import { useState } from "react";

interface AvatarUploadProps {
  onSuccess: (url: string) => void;
}

const AvatarUpload = ({ onSuccess }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return false;
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
      console.log("Uploading image...");
      const authRes = await fetch("/api/auth/imagekit-auth");
      console.log(authRes);
      const auth = await authRes.json();

      console.log(auth.authenticationParameters.signature);

      const res = await upload({
        file,
        fileName: file.name,
        signature: auth.authenticationParameters.signature,
        publicKey: auth.publicKey,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
      });

      onSuccess(res.url!); // return uploaded image url
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
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
