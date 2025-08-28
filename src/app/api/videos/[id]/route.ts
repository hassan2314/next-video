import { dbConnect } from "@/lib/db";
import { Video } from "@/models/Video";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const video = await Video.findById(params.id)
      .populate("owner", "name image email")
      .lean();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const related = await Video.find({ _id: { $ne: params.id } })
      .limit(8)
      .select("title thumbnail owner createdAt")
      .populate("owner", "name image")
      .lean();

    return NextResponse.json({ video, related }, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const video = await Video.findById(params.id);
  if (!video)
    return NextResponse.json({ error: "Video not found" }, { status: 404 });

  if (video.owner.toString() !== session.session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (video.video) await imagekit.deleteFile(video.videoFileId);
    if (video.thumbnail) await imagekit.deleteFile(video.thumbnailFileId);
  } catch (err) {
    console.error("ImageKit deletion failed:", err);
  }

  await video.deleteOne();
  return NextResponse.json({ message: "Video deleted" }, { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const video = await Video.findById(params.id);
  if (!video)
    return NextResponse.json({ error: "Video not found" }, { status: 404 });

  if (video.owner.toString() !== session.session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description } = await req.json();
  const updatedVideo = await Video.findByIdAndUpdate(
    params.id,
    { title, description },
    {
      new: true,
    }
  );

  return NextResponse.json(
    { message: "Video updated", video: updatedVideo },
    { status: 200 }
  );
}
