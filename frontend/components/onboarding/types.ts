export type OnboardingData = {
  companyName: string;
  websiteDomain: string;
  location: string;
  logoUrl: string;
};

export type OnboardingStepProps = {
  data: OnboardingData;
  update: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
};
