"use client";
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

export default function Provider({ children }: { children: React.ReactNode }) {
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
  return (
    <SessionProvider refetchInterval={5 * 60}>
      {urlEndpoint ? (
        <ImageKitProvider urlEndpoint={urlEndpoint}>{children}</ImageKitProvider>
      ) : (
        children
      )}
    </SessionProvider>
  );
}
