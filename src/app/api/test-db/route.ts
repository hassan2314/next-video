// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db"; // adjust path to where dbConnect.ts is
import { User } from "@/models/User"; // adjust to your User model

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    const count = await User.countDocuments(); // counts users in DB
    return res.status(200).json({ ok: true, users: count });
  } catch (err: any) {
    console.error("Test DB Error:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
