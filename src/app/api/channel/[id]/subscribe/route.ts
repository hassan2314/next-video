import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
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

    const { id } = await params; // channel owner id
    const viewerId = session.user.id;

    if (viewerId === id) {
      return NextResponse.json(
        { error: "Cannot subscribe to yourself" },
        { status: 400 }
      );
    }

    const channelOwner = await User.findById(id);
    const viewer = await User.findById(viewerId);
    if (!channelOwner || !viewer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSubscribed = channelOwner.subscribers?.some(
      (u: mongoose.Types.ObjectId) => u.toString() === viewerId
    );

    if (isSubscribed) {
      // Unsubscribe
      channelOwner.subscribers = (channelOwner.subscribers || []).filter(
        (u: mongoose.Types.ObjectId) => u.toString() !== viewerId
      );
      viewer.subscriptions = (viewer.subscriptions || []).filter(
        (u: mongoose.Types.ObjectId) => u.toString() !== id
      );
    } else {
      // Subscribe
      channelOwner.subscribers = [
        ...(channelOwner.subscribers || []),
        new mongoose.Types.ObjectId(viewerId),
      ];
      viewer.subscriptions = [
        ...(viewer.subscriptions || []),
        new mongoose.Types.ObjectId(id),
      ];
    }

    await channelOwner.save();
    await viewer.save();

    return NextResponse.json(
      {
        subscribed: !isSubscribed,
        subscribersCount: channelOwner.subscribers?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling subscription:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
