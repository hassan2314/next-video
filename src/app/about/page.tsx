import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Next Video is a small video-sharing app for uploading clips, watching them, and browsing channels.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About Next Video</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          Next Video is a video-sharing demo. Visitors can browse a gallery and
          watch clips. Signed-in members can upload a video to their channel,
          and channels collect the videos that belong to one person.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          When the library is empty, the gallery shows freely licensed sample
          clips (CC0 and Creative Commons Attribution) so there is something to
          play. Those samples are not stand-ins for anyone&apos;s private or
          employer footage.
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">
          Accounts use email and password. Google and GitHub sign-in are
          available when those providers are configured.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Browse videos
          </Link>
          <Link
            href="/register"
            className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg"
          >
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
