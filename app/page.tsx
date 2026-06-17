"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Sparkles,
  Download,
  Check,
  ArrowRight,
  TrendingUp,
  Brain,
  FileSearch,
} from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  } as const;

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div 
          className="container mx-auto text-center max-w-4xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-sm font-semibold text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span>Powering Career Transformations with AI</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
          >
            Optimize Your Resume <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              With Advanced AI
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Land more interviews. Instantly compare your resume against target job descriptions, discover missing keywords, improve bullet points, and build ATS-optimized resumes in minutes.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Optimize My Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn How It Works
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Features Built for Candidate Success
            </h2>
            <p className="text-slate-400 font-medium">
              We analyze every angle of your resume to make sure you get noticed by automated candidate filters and hiring managers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverable className="glow-blue">
              <CardHeader className="space-y-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 w-fit rounded-2xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">ATS Score Gauge</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 font-medium">
                  Instant visual assessment of how your resume ranks against hiring parameters and standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card hoverable className="glow-purple">
              <CardHeader className="space-y-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 w-fit rounded-2xl">
                  <Search className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Keyword Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 font-medium">
                  Find exact missing keywords and terminology from job postings that scanners look for.
                </CardDescription>
              </CardContent>
            </Card>

            <Card hoverable>
              <CardHeader className="space-y-4">
                <div className="p-3 bg-purple-500/10 text-purple-400 w-fit rounded-2xl">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">AI Rewrite Compare</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 font-medium">
                  See side-by-side original content compared with detailed, high-impact AI rewrites.
                </CardDescription>
              </CardContent>
            </Card>

            <Card hoverable>
              <CardHeader className="space-y-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 w-fit rounded-2xl">
                  <Download className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Instant PDF Export</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 font-medium">
                  Export formatted resumes built in seconds using high-quality guidelines that ATS can parse.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="container mx-auto max-w-6xl space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Optimize in 4 Easy Steps
            </h2>
            <p className="text-slate-400 font-medium">
              Transforming your resume from a generic document to an interview magnet is extremely straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-900 -translate-y-1/2 hidden md:block z-0" />
            
            {[
              {
                step: "01",
                title: "Build or Paste",
                description: "Input details using our form builder or paste your existing resume text.",
                icon: FileText,
                color: "border-blue-500/30 text-blue-400",
              },
              {
                step: "02",
                title: "Add Job Details",
                description: "Paste the targeted job listing description to help customize recommendations.",
                icon: Search,
                color: "border-indigo-500/30 text-indigo-400",
              },
              {
                step: "03",
                title: "Analyze & Improve",
                description: "Run advanced scans to get your score and see side-by-side rewrite suggestions.",
                icon: Brain,
                color: "border-purple-500/30 text-purple-400",
              },
              {
                step: "04",
                title: "Download PDF",
                description: "Generate and export your fully optimized resume ready to submit.",
                icon: Download,
                color: "border-emerald-500/30 text-emerald-400",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-900">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${item.color} bg-slate-950`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 tracking-wider">STEP {item.step}</span>
                  <h3 className="text-lg font-semibold text-slate-200">{item.title}</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Pricing Plans for Every Career Level
            </h2>
            <p className="text-slate-400 font-medium">
              Start for free and upgrade as you scale your search. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="flex flex-col justify-between border-slate-900 bg-slate-950/80">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">Basic</h3>
                  <p className="text-sm text-slate-400">For casual job seekers</p>
                </div>
                <div className="flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">$0</span>
                  <span className="ml-1 text-xl font-semibold text-slate-400">/month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-400 font-medium">
                  {["1 Resume analysis", "Standard PDF exports", "Basic Resume Builder"].map((feat, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-indigo-400 mr-2.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button variant="secondary" className="w-full">
                  Get Started
                </Button>
              </Link>
            </Card>

            {/* Pro Plan */}
            <Card className="flex flex-col justify-between border-indigo-500/20 bg-slate-950/90 ring-1 ring-indigo-500/20 relative glow-purple">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">Pro</h3>
                  <p className="text-sm text-slate-400">For active candidates</p>
                </div>
                <div className="flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">$19</span>
                  <span className="ml-1 text-xl font-semibold text-slate-400">/month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-400 font-medium">
                  {[
                    "Unlimited resume analyses",
                    "ATS keyword matching suggest",
                    "AI-powered side-by-side rewrites",
                    "Premium PDF exports",
                    "Full dashboard history logs",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-indigo-400 mr-2.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button variant="primary" className="w-full">
                  Upgrade to Pro
                </Button>
              </Link>
            </Card>

            {/* Team Plan */}
            <Card className="flex flex-col justify-between border-slate-900 bg-slate-950/80">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">Team</h3>
                  <p className="text-sm text-slate-400">For cohorts & consultants</p>
                </div>
                <div className="flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">$49</span>
                  <span className="ml-1 text-xl font-semibold text-slate-400">/month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-400 font-medium">
                  {[
                    "Everything in Pro plan",
                    "Collaborative dashboard",
                    "Custom branding & PDF designs",
                    "Dedicated API credits",
                    "Priority support access",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-indigo-400 mr-2.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="mt-8">
                <Button variant="secondary" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1.5 rounded-lg text-white">
              <FileSearch className="h-4 w-4" />
            </div>
            <span className="text-md font-bold tracking-tight text-white">ResumeAI</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} ResumeAI. Developed by Antigravity. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-slate-200">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-200">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
