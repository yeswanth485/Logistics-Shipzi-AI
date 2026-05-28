import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | PackIQ",
  description: "Sign up for a PackIQ workspace",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
