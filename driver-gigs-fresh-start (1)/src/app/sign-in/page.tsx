"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default function SignInPage() {
  const router = useRouter();

  function handleSuccess() {
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
}