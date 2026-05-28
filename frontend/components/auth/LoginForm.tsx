"use client";

import { useState, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setFirebaseSession } from "@/lib/firebaseSession";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import GoogleAuthButton from "./GoogleAuthButton";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { setUser, setOnboardingComplete } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (!auth) {
        throw new Error("Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables.");
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      await setFirebaseSession(result.user);
      setUser(result.user);
      
      // Simulate checking backend for onboarding status
      setOnboardingComplete(false); 
      router.push("/onboarding");
      
    } catch (err) {
      console.error(err);
      setErrorMsg("Invalid email or password.");
      
      // Shake animation on error
      if (formRef.current) {
        gsap.fromTo(formRef.current, 
          { x: -10 }, 
          { x: 10, duration: 0.1, yoyo: true, repeat: 5, onComplete: () => {
            gsap.set(formRef.current, { x: 0 });
          }}
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-3xl font-bold text-white">Welcome back</h2>
        <p className="mt-2 text-gray-400">Sign in to your PackIQ workspace</p>
      </div>

      <form ref={formRef} onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-packiq-blue"
            placeholder="you@company.com"
            required
          />
        </div>
        
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <Link href="#" className="text-sm font-medium text-packiq-cyan hover:text-cyan-400 transition-colors">
              Forgot password?
            </Link>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-packiq-blue"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="remember" 
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-packiq-blue focus:ring-packiq-blue focus:ring-offset-packiq-dark"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-400">
            Remember me for 30 days
          </label>
        </div>

        {errorMsg && (
          <p className="text-sm font-medium text-red-500">{errorMsg}</p>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="group relative flex w-full justify-center rounded-xl bg-packiq-blue py-3.5 px-4 font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Sign In"
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
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-white hover:text-packiq-cyan transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
