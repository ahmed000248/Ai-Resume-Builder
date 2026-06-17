import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { verifyAuth, adminDb } from "@/lib/firebase";
import { getResumeAnalysis } from "@/lib/openai";
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

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { resumeText, jobDescription } = await req.json();
    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resumeText or jobDescription in request body" },
        { status: 400 }
      );
    }

    const currentMonth = new Date().toISOString().substring(0, 7); // e.g. "2026-06"
    let userPlan = "free";

    // 2. Limit Check & User Fetching
    if (adminDb) {
      // Real Firestore Execution
      const userDoc = await adminDb.collection("users").doc(user.uid).get();
      if (userDoc.exists) {
        userPlan = userDoc.data()?.plan || "free";
      }

      if (userPlan === "free") {
        const usageSnap = await adminDb
          .collection("usage")
          .where("userId", "==", user.uid)
          .where("month", "==", currentMonth)
          .get();

        let count = 0;
        if (!usageSnap.empty) {
          count = usageSnap.docs[0].data().count || 0;
        }

        if (count >= 3) {
          return NextResponse.json({ error: "Monthly limit reached" }, { status: 403 });
        }
      }
    } else {
      // File-based DB Fallback
      const dbData = getMockDb();
      const userRecord = dbData.users[user.uid];
      userPlan = userRecord?.plan || "free";

      if (userPlan === "free") {
        const usageKey = `${user.uid}_${currentMonth}`;
        const usageRecord = dbData.usage[usageKey];
        const count = usageRecord?.count || 0;

        if (count >= 3) {
          return NextResponse.json({ error: "Monthly limit reached" }, { status: 403 });
        }
      }
    }

    // 3. Request OpenAI GPT-4o analysis
    const analysisResult = await getResumeAnalysis(resumeText, jobDescription);

    let savedAnalysis;

    // 4. Save analysis to DB & update usage counts
    if (adminDb) {
      // Real Firestore Storage
      const analysisRef = adminDb.collection("resumeAnalyses").doc();
      const payload = {
        id: analysisRef.id,
        userId: user.uid,
        resumeText,
        jobDescription,
        atsScore: analysisResult.score,
        missingKeywords: analysisResult.missing_keywords,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        rewrittenBullets: analysisResult.rewritten_bullets,
        overallSummary: analysisResult.overall_summary,
        original: resumeText,
        improved: analysisResult.overall_summary, // map fields to UI types
        createdAt: new Date().toISOString(),
      };
      
      await analysisRef.set(payload);
      savedAnalysis = payload;

      // Update Usage Doc
      const usageQuery = await adminDb
        .collection("usage")
        .where("userId", "==", user.uid)
        .where("month", "==", currentMonth)
        .get();

      if (usageQuery.empty) {
        await adminDb.collection("usage").add({
          userId: user.uid,
          month: currentMonth,
          count: 1,
        });
      } else {
        const usageDoc = usageQuery.docs[0];
        await usageDoc.ref.update({
          count: (usageDoc.data().count || 0) + 1,
        });
      }
    } else {
      // File-based DB Storage
      const dbData = getMockDb();
      const id = "analysis_" + Math.random().toString(36).substring(2, 9);
      const payload = {
        id,
        userId: user.uid,
        resumeText,
        jobDescription,
        atsScore: analysisResult.score,
        missingKeywords: analysisResult.missing_keywords,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        rewrittenBullets: analysisResult.rewritten_bullets,
        overallSummary: analysisResult.overall_summary,
        original: resumeText,
        improved: analysisResult.overall_summary,
        createdAt: new Date().toISOString(),
      };

      dbData.resumeAnalyses[id] = payload;

      const usageKey = `${user.uid}_${currentMonth}`;
      if (!dbData.usage[usageKey]) {
        dbData.usage[usageKey] = {
          userId: user.uid,
          month: currentMonth,
          count: 1,
        };
      } else {
        dbData.usage[usageKey].count += 1;
      }

      saveMockDb(dbData);
      savedAnalysis = payload;
    }

    return NextResponse.json(savedAnalysis);
  } catch (error) {
    console.error("API Analyze Error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during analysis" },
      { status: 500 }
    );
  }
}
