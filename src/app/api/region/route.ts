// src/app/api/region/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { AppSession, RegionData } from "@/types";

export async function POST(req: Request) {
  const session = (await getSession()) as AppSession | null;
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  const body = await req.json();
  const region = (body.region as RegionData) ?? { country: "IN", code: "IN" };

  session.region = region;

  if (typeof (session as any).save === "function") {
    await (session as any).save();
  }

  return NextResponse.json({ success: true, region: session.region });
}
