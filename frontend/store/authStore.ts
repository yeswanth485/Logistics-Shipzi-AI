import { User, Company } from "@/types";
import type { User as FirebaseUser } from "firebase/auth";
import { create } from "zustand";
import { clearFirebaseSession } from "@/lib/firebaseSession";

interface AuthState {
  user: FirebaseUser | null;
  supabaseUser: User | null;
  company: Company | null;
  onboardingComplete: boolean;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: FirebaseUser | null) => void;
  setSupabaseUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
  setOnboardingComplete: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  supabaseUser: null,
  company: null,
  onboardingComplete: false,
  isLoading: true,
  error: null,
  
  setUser: (user) => set({ user }),
  setSupabaseUser: (supabaseUser) => set({ supabaseUser }),
  setCompany: (company) => set({ company }),
  setOnboardingComplete: (status) => set({ onboardingComplete: status }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
  logout: () => {
    if (typeof window !== "undefined") {
      clearFirebaseSession();
    }

    set({
      user: null,
      supabaseUser: null,
      company: null,
      onboardingComplete: false,
      error: null,
    });
  },
}));
