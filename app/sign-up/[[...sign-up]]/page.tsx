'use client';

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignUpContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  return (
    <div className="flex justify-center items-center min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <SignUp fallbackRedirectUrl={redirectUrl || "/dashboard"} forceRedirectUrl={redirectUrl || undefined} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-50 dark:bg-[#0f172a]"></div>}>
      <SignUpContent />
    </Suspense>
  );
}
