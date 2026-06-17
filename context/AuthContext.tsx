"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  signInWithEmail as firebaseSignInWithEmail,
  signUpWithEmail as firebaseSignUpWithEmail,
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
} from "@/lib/firebase/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, displayName?: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isMockEnvironment =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "AIzaSyMockKeyForDevBuildOnlyChangeMe" ||
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  useEffect(() => {
    if (isMockEnvironment) {
      const stored = localStorage.getItem("mock_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored) as User);
        } catch {
          localStorage.removeItem("mock_user");
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isMockEnvironment]);

  const signIn = async (email: string, password: string) => {
    if (isMockEnvironment) {
      const mockUser = {
        uid: "mock-uid-123",
        email,
        displayName: email.split("@")[0],
        emailVerified: true,
      } as unknown as User;
      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return { user: mockUser };
    }
    return firebaseSignInWithEmail(email, password);
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (isMockEnvironment) {
      const mockUser = {
        uid: "mock-uid-123",
        email,
        displayName: displayName || email.split("@")[0],
        emailVerified: true,
      } as unknown as User;
      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return { user: mockUser };
    }
    return firebaseSignUpWithEmail(email, password, displayName);
  };

  const signInWithGoogle = async () => {
    if (isMockEnvironment) {
      const mockUser = {
        uid: "mock-uid-google",
        email: "google.user@example.com",
        displayName: "Google User",
        emailVerified: true,
      } as unknown as User;
      localStorage.setItem("mock_user", JSON.stringify(mockUser));
      setUser(mockUser);
      return { user: mockUser };
    }
    return firebaseSignInWithGoogle();
  };

  const signOut = async () => {
    if (isMockEnvironment) {
      localStorage.removeItem("mock_user");
      setUser(null);
      return;
    }
    await firebaseSignOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
