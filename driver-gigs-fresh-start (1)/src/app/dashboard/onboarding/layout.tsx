import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding - Driver Gigs",
  description: "Complete your driver onboarding process to get started with opportunities",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
