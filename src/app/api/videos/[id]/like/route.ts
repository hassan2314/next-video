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

    const hasLiked = video.likes?.some(
      (v: mongoose.Types.ObjectId) => v.toString() === userId
    );
    const hasDisliked = video.dislikes?.some(
      (v: mongoose.Types.ObjectId) => v.toString() === userId
    );

    if (hasLiked) {
      // toggle off like
      video.likes = (video.likes || []).filter(
        (v: mongoose.Types.ObjectId) => v.toString() !== userId
      );
    } else {
      // add like and remove from dislikes if present
      video.likes = [
        ...(video.likes || []),
        new mongoose.Types.ObjectId(userId),
      ];
      if (hasDisliked) {
        video.dislikes = (video.dislikes || []).filter(
          (v: mongoose.Types.ObjectId) => v.toString() !== userId
        );
      }
    }

    await video.save();

    return NextResponse.json(
      {
        liked: !hasLiked,
        disliked: false,
        likesCount: video.likes?.length || 0,
        dislikesCount: video.dislikes?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error liking video:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
