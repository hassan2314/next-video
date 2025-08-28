"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditVideo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [videoId, setVideoId] = useState<string>("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Await params to get the id
        const { id } = await params;
        setVideoId(id);

        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) throw new Error("Failed to fetch video");
        const data = await res.json();

        setTitle(data.video.title);
        setDescription(data.video.description || "");
        setVideoUrl(data.video.video);
        setThumbnailUrl(data.video.thumbnail);
      } catch (err: unknown) {
        console.error("Error fetching video:", err);
        setError("Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setSuccess("✅ Video updated successfully!");
        setTimeout(() => router.push(`/videos/${videoId}`), 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update video");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-600">Loading video details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Video</h1>

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

          {/* Video Preview */}
          {videoUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Video Preview
              </label>
              <video
                src={`${videoUrl}?tr=sr-720p`}
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-lg mt-2 shadow"
              />
            </div>
          )}

          {/* Thumbnail Preview */}
          {thumbnailUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail Preview
              </label>
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="w-40 rounded-lg mt-2 shadow"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
