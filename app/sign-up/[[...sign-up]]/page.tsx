import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <SignUp />
    </div>
  );
}
