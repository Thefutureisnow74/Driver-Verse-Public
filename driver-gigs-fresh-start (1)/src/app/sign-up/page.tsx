"use client";

import { useRouter } from "next/navigation";
import { SignUpForm } from "@/components/signup-form";

export default function SignUpPage() {
  const router = useRouter();

  function handleSuccess() {
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <SignUpForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
}