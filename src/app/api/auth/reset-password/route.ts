import { NextResponse } from "next/server";
import crypto from "crypto";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { token, password } = await req.json();

    // Hash incoming token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update password
    user.password = password; // pre-save hook will hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
