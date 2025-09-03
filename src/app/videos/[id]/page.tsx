"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { timeAgo } from "@/utils/date";
import { useSession } from "next-auth/react";
import {
  ThumbsUp,
  ThumbsDown,
  Play,
  Calendar,
  Clock,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  image: string;
}

interface Video {
  _id: string;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  createdAt: string;
  owner?: User;
  likes?: string[];
  dislikes?: string[];
}

export default function VideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [video, setVideo] = useState<Video | null>(null);
  const [related, setRelated] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [formatedDate, setFormatedDate] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

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
        const currentUserId = session?.user?.id;
        const videoLikes: string[] | undefined = data.video.likes;
        const videoDislikes: string[] | undefined = data.video.dislikes;
        setLikesCount(videoLikes?.length || 0);
        setDislikesCount(videoDislikes?.length || 0);
        if (currentUserId) {
          setLiked(!!videoLikes?.some((v) => v.toString() === currentUserId));
          setDisliked(
            !!videoDislikes?.some((v) => v.toString() === currentUserId)
          );
        } else {
          setLiked(false);
          setDisliked(false);
        }
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id, session?.user?.id]);

  async function handleLike() {
    if (!id) return;
    try {
      const res = await fetch(`/api/videos/${id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to like video");
      const data = await res.json();
      setLiked(data.liked);
      setDisliked(false);
      setLikesCount(data.likesCount ?? likesCount);
      setDislikesCount(data.dislikesCount ?? dislikesCount);
    } catch (err) {
      console.error("Error liking video:", err);
    }
  }

  async function handleDislike() {
    if (!id) return;
    try {
      const res = await fetch(`/api/videos/${id}/dislike`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to dislike video");
      const data = await res.json();
      setDisliked(data.disliked);
      setLiked(false);
      setLikesCount(data.likesCount ?? likesCount);
      setDislikesCount(data.dislikesCount ?? dislikesCount);
    } catch (err) {
      console.error("Error disliking video:", err);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete video");

      alert("Video deleted successfully");
      router.push("/"); // go back to homepage
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video");
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );

  if (!video)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Video Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The video you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Videos
          </Link>
        </div>
      </div>
    );

  const isOwner = session?.user?.id === video.owner?._id;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Video player section */}
      <div className="bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative w-full pb-[56.25%]">
            <video
              src={video.video}
              poster={video.thumbnail}
              controls
              preload="metadata"
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            {/* Video info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Play size={16} />
                  <span>12K views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{timeAgo(new Date(video.createdAt))}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    disabled={!session}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      liked
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${!session ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-pressed={liked}
                  >
                    <ThumbsUp
                      size={18}
                      className={liked ? "fill-current" : ""}
                    />
                    <span className="font-medium">{likesCount}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    disabled={!session}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      disliked
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${!session ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-pressed={disliked}
                  >
                    <ThumbsDown
                      size={18}
                      className={disliked ? "fill-current" : ""}
                    />
                    <span className="font-medium">{dislikesCount}</span>
                  </button>
                </div>

                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Channel info */}
              {video.owner && (
                <div className="flex items-center justify-between mb-6">
                  <Link
                    href={`/channel/${video.owner._id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative">
                      <img
                        src={video.owner.image}
                        alt={video.owner.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {video.owner.name}
                      </h3>
                      <p className="text-sm text-gray-500">245K subscribers</p>
                    </div>
                  </Link>

                  <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium">
                    Subscribe
                  </button>
                </div>
              )}

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-800 whitespace-pre-line">
                  {video.description}
                </p>
              </div>

              {/* Edit/Delete buttons only for owner */}
              {isOwner && (
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Link
                    href={`/videos/${video._id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Comments section - placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Comments (42)
              </h2>
              <div className="text-center py-8 text-gray-500">
                <User size={40} className="mx-auto mb-3 text-gray-300" />
                <p>Comments are disabled for this video.</p>
              </div>
            </div>
          </div>

          {/* Related videos sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-900 px-2">
              Related Videos
            </h3>

            {related.length > 0 ? (
              related.map((v) => {
                // Calculate time ago for each related video
                const relatedTimeAgo = timeAgo(new Date(v.createdAt));

                return (
                  <Link
                    key={v._id}
                    href={`/videos/${v._id}`}
                    className="flex gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={`${v.thumbnail}?tr=w-160,h-90,fo-auto`}
                        alt={v.title}
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity rounded-lg"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm leading-tight mb-1">
                        {v.title}
                      </h4>

                      {/* Owner info - using actual data from DB */}
                      {v.owner && (
                        <p className="text-xs text-gray-500 mb-1">
                          {v.owner.name}
                        </p>
                      )}

                      <div className="flex items-center text-xs text-gray-500">
                        {/* You might want to add view count to your video model */}
                        <span>0 views</span>
                        <span className="mx-1">•</span>
                        <span>{relatedTimeAgo}</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500">No related videos found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
