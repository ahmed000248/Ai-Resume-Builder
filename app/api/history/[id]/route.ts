import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { verifyAuth, adminDb } from "@/lib/firebase";
import fs from "fs";
import path from "path";

const MOCK_DB_PATH = path.join(process.cwd(), "mock_db.json");

interface MockUser {
  uid: string;
  name?: string;
  email?: string;
  plan?: string;
  createdAt?: string;
}

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

interface MockUsage {
  userId: string;
  month: string;
  count: number;
}

interface MockDb {
  users: Record<string, MockUser>;
  resumeAnalyses: Record<string, MockAnalysis>;
  usage: Record<string, MockUsage>;
}

function getMockDb(): MockDb {
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const initial: MockDb = { users: {}, resumeAnalyses: {}, usage: {} };
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf-8")) as MockDb;
  } catch {
    return { users: {}, resumeAnalyses: {}, usage: {} };
  }
}

function saveMockDb(db: MockDb) {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing scan ID in request path" }, { status: 400 });
    }

    // 1. Authenticate user
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Fetch and verify ownership of the document
    if (adminDb) {
      const docRef = adminDb.collection("resumeAnalyses").doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json({ error: "Analysis scan not found" }, { status: 404 });
      }

      if (docSnap.data()?.userId !== user.uid) {
        return NextResponse.json({ error: "Access denied: unauthorized owner" }, { status: 403 });
      }

      // 3. Delete document
      await docRef.delete();
    } else {
      const dbData = getMockDb();
      const analysisRecord = dbData.resumeAnalyses[id];

      if (!analysisRecord) {
        return NextResponse.json({ error: "Analysis scan not found" }, { status: 404 });
      }

      if (analysisRecord.userId !== user.uid) {
        return NextResponse.json({ error: "Access denied: unauthorized owner" }, { status: 403 });
      }

      // 3. Delete document from mock store
      delete dbData.resumeAnalyses[id];
      saveMockDb(dbData);
    }

    return NextResponse.json({ success: true, message: "Analysis history item deleted" });
  } catch (error) {
    console.error("API Delete History Error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred deleting history item" },
      { status: 500 }
    );
  }
}
