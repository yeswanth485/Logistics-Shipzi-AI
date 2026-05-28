import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Workspace | PackIQ",
  description: "Complete your PackIQ profile",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-packiq-dark text-white selection:bg-packiq-blue/30 overflow-hidden">
      {children}
    </div>
  );
}
