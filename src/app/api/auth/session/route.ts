import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
    });
  }
  return new Response(JSON.stringify(session), { status: 200 });
}
