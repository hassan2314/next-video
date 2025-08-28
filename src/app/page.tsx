"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/utils/date";

interface Video {
  _id: string;
  title: string;
  description?: string;
  video: string;
  thumbnail?: string;
  createdAt?: string;
}

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/video");
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();

        if (!data.videos || !Array.isArray(data.videos)) {
          throw new Error("Invalid response format");
        }

        setVideos(data.videos);
      } catch (err: any) {
        console.error("Error fetching videos:", err);
        setError(err.message || "Something went wrong while fetching videos");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-gray-800">Video Gallery</h1>
        <Link
          href="/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Upload Video
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="p-4 text-center">
          <p className="text-gray-600">Loading videos...</p>
        </div>
      )}

      {/* Video Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {videos.length > 0 ? (
            videos.map((video) => (
              <Link key={video._id} href={`/videos/${video._id}`}>
                <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white">
                  <video
                    src={video.video}
                    poster={video.thumbnail}
                    controls
                    className="w-full h-48 object-cover bg-black"
                  />
                  <div className="p-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {video.title}
                    </h2>
                    {video.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    {video.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {timeAgo(new Date(video.createdAt))}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No videos uploaded yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
