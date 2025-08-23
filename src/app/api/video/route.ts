import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { IVideo, Video } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json({ error: "No videos found" }, { status: 404 });
    }
    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body: IVideo = await req.json();
    if (!body.title || !body.description || !body.video || !body.thumbnail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const videoData = {
      ...body,
      controls: body?.controls || true,
      transforation: {
        height: 1080,
        width: 1920,
        quality: body.transforation?.quality ?? 100,
      },
    };

    const video = await Video.create(videoData);
    return NextResponse.json({ video }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
