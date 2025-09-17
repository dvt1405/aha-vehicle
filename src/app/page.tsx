"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import CTAButton from "@/components/CTAButton";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="relative w-full max-w-2xl rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-sky-50 via-white to-orange-50 shadow-[0_10px_40px_rgba(251,146,60,0.25)] overflow-hidden">
        <div className="absolute -top-6 -left-6 w-14 h-14 rounded-2xl bg-orange-200/60 blur-xl animate-float-slow"/>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-sky-200/60 blur-2xl animate-float-slower"/>
        <div className="relative animate-slide-up-fade">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-rose-500 to-sky-600 bg-clip-text text-transparent">
            {t('welcome')}
          </h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            {t('description')}
          </p>

          <div className="mt-8">
            <Image
              src="/HomeScreen.png"
              alt={t('homeIllustrationAlt')}
              width={800}
              height={450}
              className="w-full h-auto rounded-2xl shadow-lg shadow-orange-200/70 transition-transform duration-500 hover:-translate-y-1 hover:rotate-1 animate-slide-up-fade"
              priority
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/onboarding" className="w-full sm:w-auto min-w-44">
              <CTAButton className="">
                {t('start')}
              </CTAButton>
            </Link>
            <Link href="/racing" className="w-full sm:w-auto min-w-44">
              <CTAButton className="bg-sky-500 hover:bg-sky-600">
                {t('playMiniGame')}
              </CTAButton>
            </Link>
            <Link href="/orderdispatch" className="w-full sm:w-auto min-w-44">
              <CTAButton className="bg-blue-500 hover:bg-blue-600">
                {t('dispatchGame')}
              </CTAButton>
            </Link>
            <Link href="/leaderboard" className="text-orange-600 hover:underline text-sm">{t('viewLeaderboard')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
