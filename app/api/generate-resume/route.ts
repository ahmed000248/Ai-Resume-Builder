import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { verifyAuth } from "@/lib/firebase";
import { generateOptimizedResume } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { analysisResult, resumeData } = await req.json();
    if (!analysisResult || !resumeData) {
      return NextResponse.json(
        { error: "Missing analysisResult or resumeData in request body" },
        { status: 400 }
      );
    }

    // 2. Generate optimized resume content using GPT-4o-mini
    const result = await generateOptimizedResume(analysisResult, resumeData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Generate Resume Error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during optimization" },
      { status: 500 }
    );
  }
}
