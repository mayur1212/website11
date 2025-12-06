// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { User, AppSession } from "@/types";

export async function POST(req: Request) {
  const body = await req.json();
  const user = body?.user as User | undefined;

  if (!user) {
    return NextResponse.json({ success: false, message: "Missing user" }, { status: 400 });
  }

  const session = (await getSession()) as AppSession | null;
  if (!session) {
    // If your session runtime returns null when not initialized, handle gracefully
    return NextResponse.json({ success: false, message: "No session" }, { status: 401 });
  }

  // store user on session
  session.user = user;

  // some session runtimes expose save(); call if present
  if (typeof (session as any).save === "function") {
    await (session as any).save();
  }

  return NextResponse.json({ success: true, user: session.user });
}
