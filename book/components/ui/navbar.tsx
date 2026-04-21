"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useAuth, useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "owengrady890@gmail.com";

  const links = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: "My Orders", href: "/orders" },
  ];

  if (isAdmin) {
    links.push({ name: "Admin", href: "/admin" });
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-2xl">
      <div className="flex items-center gap-2 px-3 py-1 mr-4 border-r border-white/10">
        <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
          <span className="text-black font-black text-xs">B</span>
        </div>
        <span className="text-white font-bold text-sm tracking-tight hidden sm:inline-block">BookBuddy</span>
      </div>
      
      <div className="flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
              pathname === link.href
                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
        {!userId ? (
          <>
            <SignInButton mode="modal">
              <button className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white transition-all hidden sm:block">
                Log In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-white text-black hover:bg-neutral-200 transition-all">
                Sign Up
              </button>
            </SignUpButton>
          </>
        ) : (
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
        )}
      </div>
    </nav>
  );
}
