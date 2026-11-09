import { dbConnect } from "@/lib/db";
import { Video } from "@/models/Video";
import { User } from "@/models/User";
import {
  DEMO_OWNER,
  getDemoVideos,
  isDemoChannelId,
} from "@/lib/demo-catalog";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET /api/channel/[id] → get channel info + videos
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isDemoChannelId(id)) {
      return NextResponse.json(
        { owner: DEMO_OWNER, videos: getDemoVideos() },
        { status: 200 }
      );
    }

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    await dbConnect();

    const owner = await User.findById(id).select("name image email").lean();
    const videos = await Video.find({ owner: id })
      .populate("owner", "name image email")
      .sort({ createdAt: -1 });

    if (!owner && videos.length === 0) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    return NextResponse.json(
      { owner: owner ?? videos[0]?.owner ?? null, videos },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/channel/[id] error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
