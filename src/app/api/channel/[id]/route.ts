import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Video } from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

// GET /api/channel/[id] → get channel info + videos
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    // Find the user (channel owner)
    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find videos uploaded by this user
    const videos = await Video.find({ owner: id }).sort({ createdAt: -1 });

    return NextResponse.json({ user, videos }, { status: 200 });
  } catch (error) {
    console.error("GET /api/channel/[id] error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
