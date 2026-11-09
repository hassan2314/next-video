import { bumpDemoViews, isDemoClipId } from "@/lib/demo-catalog";
import { dbConnect } from "@/lib/db";
import { Video } from "@/models/Video";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (isDemoClipId(id)) {
      const views = bumpDemoViews(id);
      if (views === null) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }
      return NextResponse.json({ views }, { status: 200 });
    }

    await dbConnect();

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .select("views")
      .lean<{ views?: number }>();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ views: video.views ?? 0 }, { status: 200 });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
