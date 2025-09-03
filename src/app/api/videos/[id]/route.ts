import { dbConnect } from "@/lib/db";
import { Video } from "@/models/Video";
import { User } from "@/models/User";
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Await the params since they're now a Promise
    const { id } = await params;

    const video = await Video.findById(id)
      .populate("owner", "name image email")
      .lean();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const related = await Video.find({ _id: { $ne: id } })
      .limit(8)
      .select("title thumbnail owner views createdAt")
      .populate("owner", "name image")
      .lean();

    // Subscribers and subscription status
    const session = await getServerSession(authOptions);
    let subscribersCount = 0;
    let isSubscribed = false;
    if ((video as any)?.owner) {
      const ownerId = (video as any).owner?._id || (video as any).owner;
      const ownerUser: any = await User.findById(ownerId)
        .select("subscribers")
        .lean();
      subscribersCount = ownerUser?.subscribers?.length || 0;
      if (session?.user?.id) {
        isSubscribed = !!ownerUser?.subscribers?.some(
          (u: any) => u.toString() === session.user!.id
        );
      }
    }

    return NextResponse.json(
      {
        video,
        related,
        views: (video as any)?.views || 0,
        subscribersCount,
        isSubscribed,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    console.log("Updating video...");

    // Await the params since they're now a Promise
    const { id } = await params;

    const session = await getServerSession(authOptions);
    console.log("Session : ", session);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const video = await Video.findById(id);
    if (!video)
      return NextResponse.json({ error: "Video not found" }, { status: 404 });

    console.log("Session User: ", session?.user?.id);
    console.log("Video Owner: ", video.owner.toString());

    if (video.owner.toString() !== session?.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description } = await req.json();
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    return NextResponse.json(
      { message: "Video updated", video: updatedVideo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Await the params since they're now a Promise
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const video = await Video.findById(id);
    if (!video)
      return NextResponse.json({ error: "Video not found" }, { status: 404 });

    console.log(
      "Session User: ",
      session?.user?.id,
      "Video Owner: ",
      video.owner.toString()
    );

    if (video.owner.toString() !== session?.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Keep your ImageKit cleanup
    try {
      if (video.videoFileId) await imagekit.deleteFile(video.videoFileId);
      if (video.thumbnailFileId)
        await imagekit.deleteFile(video.thumbnailFileId);
    } catch (err) {
      console.error("ImageKit deletion failed:", err);
    }

    // Delete the video
    await video.deleteOne();

    return NextResponse.json({ message: "Video deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
