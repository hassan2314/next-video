/**
 * Inserts the demo channel and freely licensed sample clips.
 *
 * Usage (requires MONGODB_URI, already used by the app):
 *   npm run seed
 *
 * Reads .env.local then .env. Does not print connection strings.
 * Re-running replaces only this demo account's videos.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import mongoose from "mongoose";
import { DEMO_ACCOUNT, DEMO_CLIPS } from "../src/lib/demo-catalog";
import { User } from "../src/models/User";
import { Video } from "../src/models/Video";

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function safeError(error: unknown) {
  const message = error instanceof Error ? error.message : "Seed failed";
  return message.replace(/mongodb(?:\+srv)?:\/\/\S+/gi, "mongodb://***");
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "MONGODB_URI is missing. Copy .env.example to .env.local and set it, then run npm run seed."
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "test" });

  let user = await User.findOne({ email: DEMO_ACCOUNT.email });
  if (!user) {
    user = await User.create({
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
      image: DEMO_ACCOUNT.image,
      provider: "credentials",
    });
  } else {
    user.name = DEMO_ACCOUNT.name;
    user.image = DEMO_ACCOUNT.image;
    user.provider = "credentials";
    user.password = DEMO_ACCOUNT.password;
    await user.save();
  }

  await Video.deleteMany({ owner: user._id });
  await Video.insertMany(
    DEMO_CLIPS.map((clip) => ({
      title: clip.title,
      description: clip.description,
      video: clip.video,
      thumbnail: clip.thumbnail,
      owner: user._id,
      views: clip.views,
      controls: true,
      transformation: { width: 1920, height: 1080, quality: 80 },
    }))
  );

  console.log(`Seeded ${DEMO_CLIPS.length} sample videos`);
  console.log(`Demo email: ${DEMO_ACCOUNT.email}`);
  console.log(`Demo password: ${DEMO_ACCOUNT.password}`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(safeError(error));
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
