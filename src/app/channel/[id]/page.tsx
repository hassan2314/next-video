"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { timeAgo } from "@/utils/date";
import { displayThumbnail } from "@/lib/media";

interface User {
  _id: string;
  name: string;
  email?: string;
  image?: string;
}

interface Video {
  _id: string;
  owner?: User;
  title: string;
  description: string;
  video?: string;
  url?: string;
  thumbnail?: string;
  createdAt?: string;
}

export default function ChannelPage() {
  const { id } = useParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await fetch(`/api/channel/${id}`);
        const data = await res.json();
        if (res.ok) {
          setOwner(data.owner ?? null);
          setVideos(Array.isArray(data.videos) ? data.videos : []);
        } else {
          setMissing(true);
        }
      } catch (err) {
        console.error("Error fetching channel:", err);
        setMissing(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchChannel();
  }, [id]);

  if (loading) return <p className="p-4 text-gray-600">Loading...</p>;

  if (missing || !owner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Channel not found
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to the gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={owner.image || "/demo/avatar.svg"}
          alt=""
          width={100}
          height={100}
          className="h-24 w-24 rounded-full object-cover bg-blue-600"
        />
        <div>
          <h1 className="text-xl font-bold text-gray-900">{owner.name}</h1>
          <p className="text-gray-600">
            {videos.length} video{videos.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-gray-800">Videos</h2>
      {videos.length === 0 ? (
        <p className="text-gray-500">This channel has no videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Link
              key={video._id}
              href={`/videos/${video._id}`}
              className="border p-2 rounded-lg shadow bg-white hover:shadow-lg transition"
            >
              <img
                src={displayThumbnail(video.thumbnail)}
                alt=""
                className="w-full h-40 object-cover rounded-lg bg-black"
              />
              <h3 className="mt-2 font-medium text-gray-900">{video.title}</h3>
              <p className="text-sm text-gray-600 truncate">
                {video.description}
              </p>
              {video.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  {timeAgo(new Date(video.createdAt))}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
