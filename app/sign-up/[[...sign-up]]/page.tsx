import { SignUp } from "@clerk/nextjs";

export default function Page({ searchParams }: { searchParams: { redirect_url?: string } }) {
  const redirectUrl = searchParams.redirect_url;

  return (
    <div className="flex justify-center items-center min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <SignUp forceRedirectUrl={redirectUrl || "/dashboard"} fallbackRedirectUrl={redirectUrl || "/dashboard"} />
    </div>
  );
}
