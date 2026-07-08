'use client';

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  return (
    <div className="flex justify-center items-center min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <SignIn fallbackRedirectUrl={redirectUrl || "/dashboard"} forceRedirectUrl={redirectUrl || undefined} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-50 dark:bg-[#0f172a]"></div>}>
      <SignInContent />
    </Suspense>
  );
}
