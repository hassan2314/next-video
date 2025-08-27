// app/upload/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import VideoUpload from "@/components/VideoUpload";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!videoUrl) {
      setError("Please upload a video");
      return;
    }
    if (!thumbnailUrl) {
      setError("Please upload a thumbnail");
      return;
    }

    try {
      setUploading(true);
      const res = await axios.post("/api/video", {
        title,
        description,
        category,
        video: videoUrl,
        thumbnail: thumbnailUrl,
      });

      if (res.status === 200) {
        setSuccess("🎉 Video uploaded successfully!");
        setTitle("");
        setDescription("");
        setCategory("General");
        setVideoUrl("");
        setThumbnailUrl("");
        alert(
          "Video uploaded successfully! You can now view it on the dashboard."
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to upload video. Please try again."
      );
    } finally {
      setUploading(false);
      alert("Finshed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Upload New Video
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 p-3 mb-4 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              className="w-full text-gray-800 border p-3 rounded-lg focus:ring focus:ring-blue-300 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full border p-3 text-gray-800 rounded-lg focus:ring focus:ring-blue-300 mt-1"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="w-full border p-3 rounded-lg text-gray-800 focus:ring focus:ring-blue-300 mt-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>General</option>
              <option>Education</option>
              <option>Entertainment</option>
              <option>Technology</option>
              <option>Sports</option>
            </select>
          </div>

          {/* Video Upload */}

          <div>
            <label className="block text-sm font-medium  text-gray-700">
              Upload Video *
            </label>

            <VideoUpload
              fileType="video"
              onSuccess={(res) => setVideoUrl(res.url)}
              onProgress={(p) => setProgress(p)}
            />

            {progress > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Upload progress: {progress}%
              </p>
            )}

            {videoUrl && (
              <video
                src={`${videoUrl}?tr=sr-720p`} // request a streaming-ready 720p file
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-lg mt-3"
              />
            )}
            {videoUrl && (
              <p className="text-sm text-gray-500 mt-1">
                Video URL: {videoUrl}
              </p>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Thumbnail *
            </label>
            <VideoUpload
              fileType="image"
              onSuccess={(res) => setThumbnailUrl(res.url)}
            />
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="w-40 rounded-lg mt-3"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}
