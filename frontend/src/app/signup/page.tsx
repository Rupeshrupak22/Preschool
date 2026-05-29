"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8ec] px-4 text-slate-950">
      <div className="text-center">
        <h1 className="text-2xl font-black">Registration Disabled</h1>
        <p className="mt-3 text-base font-medium text-slate-600">
          Only pre-registered accounts can login. Contact your school admin.
        </p>
        <a href="/login" className="mt-5 inline-block rounded-xl bg-purple-600 px-6 py-3 text-sm font-black text-white">
          Go to Login
        </a>
      </div>
    </main>
  );
}
