"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Image as ImageIcon, Check } from "lucide-react";
import Image from "next/image";
import type { OnboardingData } from "./types";

type Step4LogoUploadProps = {
  data: OnboardingData;
  update: (data: Partial<OnboardingData>) => void;
  onComplete: () => void;
};

export default function Step4_LogoUpload({ data, update, onComplete }: Step4LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        // Create local object URL for preview
        const url = URL.createObjectURL(file);
        update({ logoUrl: url });
        setIsUploading(false);
      }
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl">
        Add your company&apos;s logo
      </h2>
      <p className="mb-10 text-gray-400">Personalize your workspace for your team.</p>

      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-white/5 p-12 backdrop-blur-xl transition-all ${
          isDragging ? "border-packiq-blue bg-white/10 scale-[1.02]" : "border-white/20 hover:bg-white/10"
        }`}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleChange}
          className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0" 
        />
        
        {data.logoUrl ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
            <div className="relative mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-white/10 shadow-2xl">
              <Image src={data.logoUrl} alt="Logo" fill sizes="128px" className="object-contain p-4" unoptimized />
              <div className="absolute -right-2 -top-2 rounded-full bg-packiq-emerald p-1 text-white shadow-lg">
                <Check className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm font-medium text-white">Logo uploaded successfully</p>
            <p className="mt-1 text-xs text-packiq-cyan">Click or drag to change</p>
          </motion.div>
        ) : isUploading ? (
          <div className="flex w-full flex-col items-center">
            <div className="mb-6 h-16 w-16 animate-pulse rounded-2xl bg-white/10 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-500" />
            </div>
            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
              <div 
                className="h-full bg-gradient-to-r from-packiq-blue to-packiq-cyan transition-all duration-200" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="mt-3 text-sm text-gray-400">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center pointer-events-none">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-6 rounded-full bg-white/5 p-5 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              <UploadCloud className="h-10 w-10 text-packiq-blue" />
            </motion.div>
            <p className="mb-2 text-lg font-medium text-white">
              Drag your logo here or <span className="text-packiq-blue">click to upload</span>
            </p>
            <p className="text-xs text-gray-500">Supported: PNG, JPG, SVG (Max 5MB)</p>
          </div>
        )}
      </div>

      <button onClick={onComplete} className="mt-8 text-sm text-gray-500 hover:text-white transition-colors underline underline-offset-4">
        Skip for now
      </button>
    </div>
  );
}
