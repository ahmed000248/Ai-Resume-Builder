"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FilePlus2,
  History,
  User,
  LogOut,
  Menu,
  X,
  FileSearch,
} from "lucide-react";

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const sidebarLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create Resume", href: "/dashboard/create", icon: FilePlus2 },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-900 bg-slate-950 px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl text-white">
            <FileSearch className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">ResumeAI</span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 focus:outline-none"
          aria-label="Toggle navigation menu"
          title="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed bottom-0 top-16 z-40 flex w-64 flex-col border-r border-slate-900 bg-slate-950 px-4 py-6 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo (Desktop only) */}
        <div className="hidden items-center space-x-2 mb-8 md:flex">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl text-white">
            <FileSearch className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            ResumeAI
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-inner"
                    : "text-slate-400 border border-transparent hover:bg-slate-900/60 hover:text-slate-200"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-indigo-400" : "text-slate-400")} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile + Logout */}
        <div className="border-t border-slate-900 pt-6">
          <div className="flex items-center space-x-3 px-3 py-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-blue-500/10 uppercase">
              {user?.displayName?.[0] || user?.email?.[0] || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="truncate text-sm font-semibold text-slate-200">
                {user?.displayName || "User"}
              </h4>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              signOut();
              closeSidebar();
            }}
            className="flex w-full items-center space-x-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 hover:border-red-500/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
