"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";
import { FileSearch } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mb-6 flex flex-col items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <FileSearch className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">ResumeAI</span>
        </Link>
      </div>
      
      <AuthForm mode="signup" />
    </div>
  );
}
