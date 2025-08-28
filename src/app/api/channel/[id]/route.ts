import { dbConnect } from "@/lib/db";
import { Video } from "@/models/Video";
import { NextResponse } from "next/server";

// GET /api/channel/[id] → get channel info + videos
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Await the params since they're now a Promise
    const { id } = await params;

    const videos = await Video.find({ owner: id })
      .populate("owner", "name image email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error("GET /api/channel/[id] error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
