// app/api/videos/[id]/route.ts
import { dbConnect } from "@/lib/db";
import { Video } from "@/models/Video";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const video = await Video.findById(params.id);
  if (!video) return new Response("Video not found", { status: 404 });

  // Get related videos (same category or random for now)
  const related = await Video.find({
    _id: { $ne: params.id },
    category: video.category,
  })
    .limit(8)
    .select("title thumbnail channelName");

  return Response.json({ video, related });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const video = await Video.findByIdAndDelete(params.id);
  if (!video) return new Response("Video not found", { status: 404 });
  return new Response("Video deleted", { status: 200 });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const video = await Video.findByIdAndUpdate(params.id, await req.json());
  if (!video) return new Response("Video not found", { status: 404 });
  return new Response("Video updated", { status: 200 });
}
