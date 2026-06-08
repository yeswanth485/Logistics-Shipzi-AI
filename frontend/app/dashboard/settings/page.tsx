"use client";

import { useAuthStore } from "@/store/authStore";
import { Settings, User, Mail, Building2 } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const { user, company } = useAuthStore();

  const displayName = user?.displayName || company?.company_name || "Guest User";
  const email = user?.email || "";
  const avatarUrl = user?.photoURL || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="h-8 w-8 text-gray-400" />
          Workspace Settings
        </h1>
        <p className="mt-2 text-gray-400">Manage your profile and workspace preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:col-span-2">
          <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-packiq-blue" />
            Profile Information
          </h3>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full ring-4 ring-packiq-blue/30 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-packiq-blue to-packiq-cyan text-3xl font-bold text-white ring-4 ring-packiq-blue/30">
                  {initial}
                </div>
              )}
              <span className="inline-block rounded-full bg-packiq-emerald/20 px-3 py-1 text-xs font-medium text-packiq-emerald">
                Google Account
              </span>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-white">{displayName}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-white">{email}</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400 uppercase tracking-wider">Company</label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-white">{company?.company_name || "Not set"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="font-heading text-lg font-bold text-white mb-4">Account Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Auth Provider</span>
              <span className="text-white font-medium">Firebase (Google)</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-gray-400">User ID</span>
              <span className="text-gray-300 font-mono text-xs truncate max-w-[180px]">{user?.uid || "—"}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-gray-400">Location</span>
              <span className="text-white">{company?.location || "Not set"}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-gray-400">Website</span>
              <span className="text-packiq-cyan">{company?.website_domain || "Not set"}</span>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="font-heading text-lg font-bold text-white mb-4">Workspace</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Company Name</span>
              <span className="text-white font-medium">{company?.company_name || "Not set"}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-gray-400">Warehouse Type</span>
              <span className="text-white capitalize">{company?.warehouse_type || "Not set"}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-gray-400">Default Carrier</span>
              <span className="text-white">{company?.default_carrier || "Not set"}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between">
              <span className="text-gray-400">Plan</span>
              <span className="inline-block rounded-full bg-packiq-blue/20 px-3 py-0.5 text-xs font-medium text-packiq-blue">Pro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
