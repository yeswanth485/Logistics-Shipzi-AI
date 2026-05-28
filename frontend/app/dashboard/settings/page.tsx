import ApiKeyManager from "@/components/settings/ApiKeyManager";
import TeamMembers from "@/components/settings/TeamMembers";
import BillingUsage from "@/components/settings/BillingUsage";
import { Settings } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | PackIQ",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="h-8 w-8 text-gray-400" />
          Workspace Settings
        </h1>
        <p className="mt-2 text-gray-400">Manage your workspace preferences, team, and billing.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ApiKeyManager />
        <TeamMembers />
        <BillingUsage />
      </div>
    </div>
  );
}
