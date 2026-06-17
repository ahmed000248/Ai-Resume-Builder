"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/Button";
import { FileSearch } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
            <FileSearch className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            ResumeAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-slate-200 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-slate-200 transition-colors">
            How it Works
          </Link>
          <Link href="#pricing" className="hover:text-slate-200 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* CTAs */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
                Sign In
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
