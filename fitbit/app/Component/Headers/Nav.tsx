"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Backdrop blur overlay when mobile menu open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-amber-900/10 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`sticky top-0 z-20 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-amber-100/60 border-b border-amber-200/60"
            : "bg-gradient-to-b from-amber-100 to-white/80 backdrop-blur-sm border-b border-amber-100/50"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-amber-300/50 blur-sm" />
              </div>
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-amber-900 group-hover:text-amber-700 transition-colors duration-200">
                Ayurleaf
              </span>
            </Link>

            {/* Desktop Nav — centered */}
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <NavLink href="/fitness" active={isActive("/fitness")}>
                AyuFit
              </NavLink>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() =>
                  window.open("https://ayurleaf.vercel.app/", "_blank")
                }
                className="
                  relative overflow-hidden
                  px-5 py-2.5 rounded-full
                  bg-amber-500 hover:bg-amber-600
                  text-white text-sm font-medium
                  shadow-sm shadow-amber-200
                  transition-all duration-200
                  hover:shadow-md hover:shadow-amber-200
                  hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-sm
                "
              >
                <span className="relative z-10">Get Instant Help</span>
              </button>
            </div>

            {/* Hamburger */}
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className={`
                md:hidden flex items-center justify-center
                w-9 h-9 rounded-lg
                transition-all duration-200
                ${
                  isOpen
                    ? "bg-amber-100 text-amber-900"
                    : "text-amber-800 hover:bg-amber-50 hover:text-amber-900"
                }
              `}
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-5 h-5 transition-all duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path
                  d={
                    isOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="bg-white/98 border-t border-amber-100 px-4 pt-3 pb-5 space-y-1">
            <MobileNavLink
              href="/fitness"
              active={isActive("/fitness")}
              onClick={() => setIsOpen(false)}
            >
              AyuFit
            </MobileNavLink>

            <div className="border-t border-amber-100 my-3" />

            <button
              onClick={() => {
                setIsOpen(false);
                window.open("https://ayurleaf.vercel.app/", "_blank");
              }}
              className="
                w-full py-3 px-5 rounded-xl
                bg-amber-500 hover:bg-amber-600
                text-white text-base font-medium
                shadow-sm shadow-amber-200
                transition-all duration-200
                active:scale-[0.98]
              "
            >
              Get Instant Help
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

/* ---- Sub-components ---- */

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        relative px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200
        ${
          active
            ? "text-amber-900 bg-amber-100"
            : "text-amber-700 hover:text-amber-900 hover:bg-amber-50"
        }
      `}
    >
      {children}
      {active && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
        transition-all duration-200
        ${
          active
            ? "text-amber-900 bg-amber-100"
            : "text-amber-700 hover:text-amber-900 hover:bg-amber-50"
        }
      `}
    >
      {active && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
      )}
      {children}
    </Link>
  );
}

export default Nav;