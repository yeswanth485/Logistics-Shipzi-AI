"use client";

import { useState } from "react";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import Step1_CompanyName from "@/components/onboarding/Step1_CompanyName";
import Step2_WebsiteDomain from "@/components/onboarding/Step2_WebsiteDomain";
import Step3_Location from "@/components/onboarding/Step3_Location";
import Step4_LogoUpload from "@/components/onboarding/Step4_LogoUpload";
import OnboardingComplete from "@/components/onboarding/OnboardingComplete";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    websiteDomain: "",
    location: "",
    logoUrl: "",
  });
  
  const { setCompany, setOnboardingComplete } = useAuthStore();
  const router = useRouter();

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const updateForm = (data: Partial<typeof formData>) => setFormData(p => ({ ...p, ...data }));

  const handleComplete = async () => {
    // In a real app, we'd make an API call to FastAPI here to create the company
    // For now, we mock success.
    console.log("Submitting onboarding data", formData);
    
    setCompany({
      id: "mock-company-id",
      company_name: formData.companyName,
      website_domain: formData.websiteDomain,
      location: formData.location,
      logo_url: formData.logoUrl,
      created_at: new Date().toISOString()
    });
    setOnboardingComplete(true);
    
    setStep(5);
  };

  return (
    <OnboardingShell step={step} onBack={handleBack} onNext={step === 4 ? handleComplete : handleNext}>
      {step === 1 && <Step1_CompanyName data={formData} update={updateForm} onNext={handleNext} />}
      {step === 2 && <Step2_WebsiteDomain data={formData} update={updateForm} onNext={handleNext} />}
      {step === 3 && <Step3_Location data={formData} update={updateForm} onNext={handleNext} />}
      {step === 4 && <Step4_LogoUpload data={formData} update={updateForm} onComplete={handleComplete} />}
      {step === 5 && <OnboardingComplete companyName={formData.companyName} onFinish={() => router.push("/dashboard")} />}
    </OnboardingShell>
  );
}
