"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { User, Mail, ShieldAlert, LogOut, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
          <User className="h-7 w-7 mr-2 text-indigo-400" />
          My Profile Settings
        </h1>
        <p className="text-slate-400 font-medium mt-1">
          Manage your account profile, personal details, and security integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-950/20 border-slate-900 shadow-md">
          <CardHeader className="flex flex-col items-center text-center pb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/10">
              {user?.displayName ? user.displayName.split(" ").map((n) => n[0]).join("") : "U"}
            </div>
            <h2 className="text-lg font-bold text-white mt-4">{user?.displayName || "Resume Candidate"}</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">{user?.email}</p>
          </CardHeader>
          <CardContent className="border-t border-slate-900/60 pt-4 flex flex-col space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-semibold">Email Verified</span>
              {user?.emailVerified ? (
                <span className="flex items-center text-emerald-400 font-bold text-xs bg-emerald-500/5 px-2 py-1 border border-emerald-500/10 rounded-lg">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center text-amber-400 font-bold text-xs bg-amber-500/5 px-2 py-1 border border-amber-500/10 rounded-lg">
                  <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                  Unverified
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={signOut} className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/20">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out Account
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-slate-950/20 border-slate-900 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-200">Account Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Name"
                required
              />
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-600" />
                  <Input
                    value={user?.email || ""}
                    disabled
                    placeholder="email@example.com"
                    className="pl-10 text-slate-500 bg-slate-950 border-slate-900 cursor-not-allowed"
                  />
                </div>
                <span className="text-slate-600 text-xs font-semibold">Email cannot be changed directly. Contact support if required.</span>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
