// src/app/api/language/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { AppSession, Language } from "@/types";

export async function POST(req: Request) {
  const session = (await getSession()) as AppSession | null;
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  const body = await req.json();
  const language = (body.language as Language) || "en";

  session.language = language;

  if (typeof (session as any).save === "function") {
    await (session as any).save();
  }

  return NextResponse.json({ success: true, language: session.language });
}
