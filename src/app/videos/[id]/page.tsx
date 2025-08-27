// app/videos/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    // Fetch video details
    fetch(`/api/videos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVideo(data.video);
        setRelated(data.related); // backend should return related videos
      });
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Main video section */}
      <div className="flex-1">
        <video
          src={video.url}
          controls
          className="w-full rounded-lg shadow-lg"
        />
        <h2 className="text-xl font-semibold mt-2">{video.title}</h2>
        <p className="text-gray-600 text-sm">{video.description}</p>
      </div>

      {/* Related videos */}
      <div className="w-full md:w-80 flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Related Videos</h3>
        {related.map((v) => (
          <a
            key={v._id}
            href={`/videos/${v._id}`}
            className="flex gap-2 hover:bg-gray-100 p-2 rounded-lg"
          >
            <img
              src={v.thumbnail}
              alt={v.title}
              className="w-28 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium text-sm line-clamp-2">{v.title}</p>
              <p className="text-xs text-gray-500">{v.channelName}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
