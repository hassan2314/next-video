"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchVideo() {
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) throw new Error("Failed to fetch video");
        const data = await res.json();
        setVideo(data.video);
        setRelated(data.related);
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  if (loading) return <p className="p-4 text-gray-600">Loading video...</p>;
  if (!video) return <p className="p-4 text-red-600">Video not found</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Main video */}
      <div className="flex-1">
        <div className="relative w-full pb-[56.25%]">
          <video
            src={video.video}
            poster={video.thumbnail}
            controls
            preload="metadata"
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg bg-black object-contain"
          />
        </div>

        <h2 className="text-xl font-semibold mt-2">{video.title}</h2>
        <p className="text-gray-600 text-sm">{video.description}</p>
      </div>

      {/* Related videos */}
      <div className="w-full md:w-80 flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Related Videos</h3>
        {related.length > 0 ? (
          related.map((v) => (
            <a
              key={v._id}
              href={`/videos/${v._id}`}
              className="flex gap-2 hover:bg-gray-100 p-2 rounded-lg"
            >
              <img
                src={`${v.thumbnail}?tr=w-160,h-90,fo-auto`}
                alt={v.title}
                className="w-28 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium text-sm line-clamp-2">{v.title}</p>
                {v.channelName && (
                  <p className="text-xs text-gray-500">{v.channelName}</p>
                )}
              </div>
            </a>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No related videos</p>
        )}
      </div>
    </div>
  );
}
