import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { IVideo, Video } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .populate("owner", "name image")
      .lean();
    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error(error);
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

    const body: Partial<IVideo> = await req.json();
    if (!body.title || !body.video || !body.thumbnail || !body.owner) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(body);
    const videoData = {
      ...body,
      owner: new mongoose.Types.ObjectId(body.owner),
      controls: body?.controls ?? true,
      transformation: {
        height: 1080,
        width: 1920,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const video = await Video.create(videoData);
    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
