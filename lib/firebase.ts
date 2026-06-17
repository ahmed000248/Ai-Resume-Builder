import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { NextRequest } from "next/server";

const hasFirebaseEnv = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

if (hasFirebaseEnv) {
  try {
    if (getApps().length === 0) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n");
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log("Firebase Admin SDK initialized successfully.");
    }
  } catch (error) {
    console.error("Firebase Admin SDK initialization failed:", error);
  }
} else {
  console.warn(
    "Firebase Admin credentials missing. Running in Mock fallback mode."
  );
}

export const adminDb: Firestore | null = hasFirebaseEnv ? getFirestore() : null;
export const adminAuth: Auth | null = hasFirebaseEnv ? getAuth() : null;

export interface AuthenticatedUser {
  uid: string;
  email?: string;
}

/**
 * Verifies the Bearer authorization token using Firebase Admin SDK.
 * Falls back to mock authentication if environment variables are missing.
 */
export async function verifyAuth(req: NextRequest): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (!hasFirebaseEnv) {
      // In mock development mode, return a default mock user when no auth token is present
      return { uid: "mock-uid-123", email: "candidate@example.com" };
    }
    return null;
  }

  const token = authHeader.split("Bearer ")[1];

  if (!hasFirebaseEnv) {
    // Return mock user mapping if mock token was used
    return {
      uid: token === "mock-uid-google" ? "mock-uid-google" : "mock-uid-123",
      email: token === "mock-uid-google" ? "google.user@example.com" : "candidate@example.com",
    };
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error("Firebase Auth Token Verification Error:", error);
    return null;
  }
}
