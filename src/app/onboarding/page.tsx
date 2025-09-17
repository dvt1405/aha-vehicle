"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import CTAButton from "@/components/CTAButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "dvc-tutorial-complete";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // If already completed, bounce to home
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (done === "true") {
        router.replace("/home");
      }
    } catch {}
  }, [router]);

  const steps = useMemo(
    () => [
      {
        key: "vehicle",
        title: "This is your vehicle. Take care of it!",
        image: "/TutorialScreen1.png",
        description: "Keep it clean and happy to earn small bonuses.",
      },
      {
        key: "tasks",
        title: "Complete tasks to earn AhaCoins!",
        image: "/2. Basic Care Tutorial.png",
        description: "Ship 1 package/day = 10 coins. Wash and deliver to progress!",
      },
      {
        key: "upgrade",
        title: "Use AhaCoins to upgrade and clean your vehicle!",
        image: "/3. Upgrade Tutorial.png",
        description: "Buy shiny wheels, performance kits, and more.",
      },
      {
        key: "finish",
        title: "Now you are ready to start your journey!",
        image: "/preview_after_upgrade.png",
        description: "Good luck, driver!",
      },
    ],
    []
  );

  const last = step === steps.length - 1;

  function completeAndGoHome() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    router.replace("/home");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white to-orange-50 shadow-[0_10px_40px_rgba(251,146,60,0.2)] animate-slide-up-fade">
        <div className="flex items-start justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Onboarding</h2>
          <button
            onClick={completeAndGoHome}
            className="text-sm text-orange-600 hover:text-orange-700 hover:underline"
            aria-label="Skip tutorial"
          >
            Skip
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg sm:text-xl font-bold text-gray-900">{steps[step].title}</p>
          <p className="mt-1 text-sm text-gray-600">{steps[step].description}</p>
        </div>

        <div className="mt-6">
          <Image
            src={steps[step].image}
            alt={steps[step].title}
            width={900}
            height={600}
            className="w-full h-auto rounded-2xl shadow-lg bg-white object-contain transition-transform duration-500 hover:-translate-y-1 hover:rotate-1 animate-slide-up-fade"
            priority
          />
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={
                "h-2 w-2 rounded-full transition-all duration-300 " +
                (i === step ? "bg-orange-500 w-6 shadow-[0_0_10px_rgba(251,146,60,0.45)]" : "bg-orange-200")
              }
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-40"
          >
            Back
          </button>

          {!last ? (
            <CTAButton onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} className="w-auto min-w-40">
              Next
            </CTAButton>
          ) : (
            <button
              onClick={completeAndGoHome}
              className="w-auto min-w-40 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            >
              Play Now
            </button>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:underline">Return to Home</Link>
        </div>
      </div>
    </div>
  );
}
