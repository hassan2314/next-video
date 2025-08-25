import { NextResponse } from "next/server";
import crypto from "crypto";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔹 Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and save
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Reset link (frontend route)
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or use Mailgun, SendGrid, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
             <p>This link will expire in 1 hour.</p>`,
    });

    return NextResponse.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
