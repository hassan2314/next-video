"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formatedDate, setFormatedDate] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchVideo() {
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) throw new Error("Failed to fetch video");
        const data = await res.json();
        setVideo(data.video);
        setRelated(data.related);
        setFormatedDate(
          new Date(data.video.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  const calculateDateDiff = (date2: Date) => {
    const date1 = new Date();
    const diffInMs = date1.getTime() - date2.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

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
        <p className="text-gray-600 text-sm">Upload Date {formatedDate}</p>
        <p className="text-gray-600 text-sm">
          {calculateDateDiff(new Date(video.createdAt))}{" "}
          {calculateDateDiff(new Date(video.createdAt)) === 1 ? "Day" : "Days"}{" "}
          ago
        </p>

        {/* Owner info */}
        {video.owner && (
          <div className="flex items-center gap-2 mt-4">
            <Link
              href={`/channel/${video.owner._id}`}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <img
                src={video.owner.image}
                alt={video.owner.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="font-medium">{video.owner.name}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Related videos */}
      <div className="w-full md:w-80 flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Related Videos</h3>
        {related.length > 0 ? (
          related.map((v) => (
            <Link
              key={v._id}
              href={`/videos/${v._id}`}
              className="flex gap-2 hover:bg-gray-100 p-2 rounded-lg"
            >
              <img
                src={`${v.thumbnail}?tr=w-160,h-90,fo-auto`}
                alt={v.title}
                className="w-28 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm line-clamp-2">{v.title}</p>

                {/* Owner info */}
                {v.owner && (
                  <div className="flex items-center gap-1 mt-1">
                    <img
                      src={v.owner.image || "/default-avatar.png"}
                      alt={v.owner.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <p className="text-xs text-gray-500">{v.owner.name}</p>
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No related videos</p>
        )}
      </div>
    </div>
  );
}
