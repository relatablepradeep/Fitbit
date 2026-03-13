import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-amber-50 to-amber-100 px-6">

      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-amber-900 mb-4">
        Health Dashboard
      </h1>

      <p className="text-amber-700 text-sm md:text-base max-w-md text-center mb-10">
        Connect your Fitbit account to access your health insights and track
        your wellness in a simple and secure way.
      </p>

      <Link href="/api/auth/login">
        <button className="px-8 py-3 rounded-full bg-amber-600 text-white font-medium shadow-md shadow-amber-200/60 transition-all duration-200 hover:bg-amber-700 hover:-translate-y-0.5">
          Connect Fitbit
        </button>
      </Link>

    </main>
  );
}