import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { verifyAuth, adminDb } from "@/lib/firebase";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const MOCK_DB_PATH = path.join(process.cwd(), "mock_db.json");

interface MockAnalysis {
  id: string;
  userId: string;
  resumeText: string;
  jobDescription: string;
  atsScore: number;
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  rewrittenBullets: {
    experience: string[];
    projects: string[];
  };
  overallSummary: string;
  original: string;
  improved: string;
  createdAt: string;
}

interface MockDb {
  resumeAnalyses: Record<string, MockAnalysis>;
}

function getMockDb(): MockDb {
  if (!fs.existsSync(MOCK_DB_PATH)) {
    return { resumeAnalyses: {} };
  }
  try {
    return JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf-8")) as MockDb;
  } catch {
    return { resumeAnalyses: {} };
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    let historyList: MockAnalysis[] = [];

    // 2. Fetch records
    if (adminDb) {
      const snap = await adminDb
        .collection("resumeAnalyses")
        .where("userId", "==", user.uid)
        .get();

      snap.forEach((doc: QueryDocumentSnapshot) => {
        historyList.push(doc.data() as MockAnalysis);
      });
      
      // Sort desc
      historyList.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      const dbData = getMockDb();
      const analyses = Object.values(dbData.resumeAnalyses || {});
      
      historyList = analyses
        .filter((item: MockAnalysis) => item.userId === user.uid)
        .sort((a: MockAnalysis, b: MockAnalysis) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json(historyList);
  } catch (error) {
    console.error("API Get History Error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred fetching history" },
      { status: 500 }
    );
  }
}
