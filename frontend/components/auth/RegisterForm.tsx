"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setFirebaseSession } from "@/lib/firebaseSession";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleAuthButton from "./GoogleAuthButton";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();
  const { setUser, setOnboardingComplete } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (!auth) {
        throw new Error("Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables.");
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: fullName });
      await setFirebaseSession(result.user);
      setUser(result.user);
      setOnboardingComplete(false);
      
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/onboarding");
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to create account.");
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-md">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-packiq-emerald/20 text-packiq-emerald shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="font-heading text-3xl font-bold text-white">Account Created!</h2>
        <p className="mt-2 text-gray-400">Redirecting to setup your workspace...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl font-bold text-white">Create an account</h2>
        <p className="mt-2 text-gray-400">Start optimizing your packaging today</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Full Name</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-packiq-blue"
            placeholder="Jane Doe"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-packiq-blue"
            placeholder="you@company.com"
            required
          />
        </div>
        
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-packiq-blue"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-packiq-blue"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input 
              type="checkbox" 
              id="terms" 
              required
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-packiq-blue focus:ring-packiq-blue focus:ring-offset-packiq-dark"
            />
          </div>
          <label htmlFor="terms" className="ml-2 block text-xs text-gray-400">
            I agree to the <Link href="#" className="text-packiq-cyan hover:underline">Terms of Service</Link> and <Link href="#" className="text-packiq-cyan hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        {errorMsg && (
          <p className="text-sm font-medium text-red-500">{errorMsg}</p>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="group relative flex w-full justify-center rounded-xl bg-packiq-blue py-3.5 px-4 font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] disabled:opacity-70 mt-2"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <GoogleAuthButton />

      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-white hover:text-packiq-cyan transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
