// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { AppSession } from "@/types";

export async function POST() {
  const session = (await getSession()) as AppSession | null;
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // Make user nullable (depends on your AppSession/User types)
  session.user = null;

  if (typeof (session as any).save === "function") {
    await (session as any).save();
  }

  return NextResponse.json({ success: true });
}
