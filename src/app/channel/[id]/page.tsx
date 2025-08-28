"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { timeAgo } from "@/utils/date";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface Video {
  _id: string;
  owner: User;
  title: string;
  description: string;
  url: string;
  createdAt?: string;
}

export default function ChannelPage() {
  const { id } = useParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await fetch(`/api/channel/${id}`);
        const data = await res.json();
        if (res.ok) {
          setVideos(data.videos);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error fetching channel:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchChannel();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  // if (!user) return <p>Channel not found</p>;
  // https://ik.imagekit.io/fklsjyb5h/as_ZNKSoP2w0.jpg
  // https://ik.imagekit.io/fklsjyb5h/as_ZNKSoP2w0.jpg
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={videos[0].owner.image || "/default-avatar.png"}
          alt={videos[0].owner.name}
          width={100}
          height={100}
          className="rounded-full"
        />

        <div>
          <h1 className="text-xl font-bold">{videos[0].owner.name}</h1>
          <p className="text-gray-600">{videos[0].owner.email}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video._id} className="border p-2 rounded-lg shadow">
            <video controls className="w-full rounded-lg">
              <source src={video.url} type="video/mp4" />
            </video>
            <h3 className="mt-2 font-medium">{video.title}</h3>
            <p className="text-sm text-gray-600 truncate">
              {video.description}
            </p>
            {video.createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                {timeAgo(new Date(video.createdAt))}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
