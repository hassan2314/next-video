import { dbConnect } from "@/lib/db";
import { Video } from "@/models/Video";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const hasDisliked = video.dislikes?.some(
      (v: mongoose.Types.ObjectId) => v.toString() === userId
    );
    const hasLiked = video.likes?.some(
      (v: mongoose.Types.ObjectId) => v.toString() === userId
    );

    if (hasDisliked) {
      // toggle off dislike
      video.dislikes = (video.dislikes || []).filter(
        (v: mongoose.Types.ObjectId) => v.toString() !== userId
      );
    } else {
      // add dislike and remove from likes if present
      video.dislikes = [
        ...(video.dislikes || []),
        new mongoose.Types.ObjectId(userId),
      ];
      if (hasLiked) {
        video.likes = (video.likes || []).filter(
          (v: mongoose.Types.ObjectId) => v.toString() !== userId
        );
      }
    }

    await video.save();

    return NextResponse.json(
      {
        disliked: !hasDisliked,
        liked: false,
        dislikesCount: video.dislikes?.length || 0,
        likesCount: video.likes?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error disliking video:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
