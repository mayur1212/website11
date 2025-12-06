// src/app/api/auth/user/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { AppSession, User } from "@/types";

export async function GET() {
  const session = (await getSession()) as AppSession | null;
  if (!session) {
    return NextResponse.json({ success: true, user: null });
  }
  return NextResponse.json({ success: true, user: session.user ?? null });
}

export async function PUT(req: Request) {
  const session = (await getSession()) as AppSession | null;
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const partial = (await req.json()) as Partial<User>;

  // Merge safely — make sure User type permits optional id (we made it optional earlier)
  const merged = { ...(session.user ?? {}), ...partial } as User;

  session.user = merged;

  if (typeof (session as any).save === "function") {
    await (session as any).save();
  }

  return NextResponse.json({ success: true, user: session.user ?? null });
}
