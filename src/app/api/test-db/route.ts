import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db"; // adjust path
import { User } from "@/models/User"; // adjust path

export async function GET() {
  try {
    await dbConnect();
    const count = await User.countDocuments();
    return NextResponse.json({ ok: true, users: count });
  } catch (err: any) {
    console.error("Test DB Error:", err.message);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
