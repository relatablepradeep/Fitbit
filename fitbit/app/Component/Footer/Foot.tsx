"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 z-20 w-full bg-gradient-to-b from-[#fffbf3] to-[#fef9ee] border-t border-amber-200/70 shadow-[0_-1px_12px_rgba(180,120,20,0.07)]">
      <div className="max-w-screen-xl mx-auto px-5 h-16 sm:h-[68px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-[50%_12px_50%_12px] bg-amber-400 flex items-center justify-center text-lg shadow-sm">
            🌿
          </div>
          <span className="font-serif text-xl sm:text-[22px] font-semibold tracking-tight text-amber-900">
            Ayur<span className="text-amber-600">leaf</span>
          </span>
        </Link>

        {/* Desktop center link */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          <Link
            href="/fitness"
            className={`text-sm font-medium px-5 py-2 rounded-full border transition-all duration-150 ${
              pathname === "/fitness"
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "text-amber-700 border-transparent hover:bg-amber-50 hover:border-amber-200 hover:text-amber-900"
            }`}
          >
            AyuFit
          </Link>
        </div>

        {/* Desktop CTA */}
        <button
          onClick={() => router.push("/BMI")}
          className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium shadow-md shadow-amber-200/60 transition-all duration-150 hover:-translate-y-px"
        >
          Get Instant Help
        </button>

        {/* Hamburger */}
        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-[5px] rounded-lg hover:bg-amber-50 transition-colors"
        >
          <span
            className={`block w-[22px] h-[2px] bg-amber-700 rounded transition-all duration-200 ${
              isOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-amber-700 rounded transition-all duration-200 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-amber-700 rounded transition-all duration-200 ${
              isOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>

      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#fffbf2] border-t border-amber-100 px-4 pt-3 pb-5 space-y-1">
          <Link
            href="/fitness"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === "/fitness"
                ? "bg-amber-100 text-amber-900"
                : "text-amber-700 hover:bg-amber-50 hover:text-amber-900"
            }`}
          >
            {pathname === "/fitness" && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
            AyuFit
          </Link>

          <hr className="border-amber-100" />

          <button
            onClick={() => router.push("/BMI")}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium shadow-sm shadow-amber-200 transition-colors"
          >
            Get Instant Help
          </button>
        </div>
      </div>
    </nav>
  );
}