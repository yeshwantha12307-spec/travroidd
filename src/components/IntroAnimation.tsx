import React, { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Check if intro was already shown in this session
    const hasSeenIntro = sessionStorage.getItem('travroidd_intro_seen');

    if ((hasSeenIntro && !forceShow) || prefersReducedMotion) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Step 1: Initial mount (Logo starts scaling and fading in)
    const timerStep2 = setTimeout(() => {
      setStep(2); // Logo gentle glide & flight lift
    }, 400);

    // Step 3: Reveal Travroidd brand typography
    const timerStep3 = setTimeout(() => {
      setStep(3);
    }, 850);

    // Step 4: Begin graceful fade-out
    const timerFadeOut = setTimeout(() => {
      setIsFadingOut(true);
    }, 2100);

    // Step 5: Complete and unmount
    const timerComplete = setTimeout(() => {
      sessionStorage.setItem('travroidd_intro_seen', 'true');
      setIsVisible(false);
      onComplete?.();
    }, 2800);

    // Fail-safe timeout to guarantee website is NEVER stuck
    const failSafeTimer = setTimeout(() => {
      sessionStorage.setItem('travroidd_intro_seen', 'true');
      setIsVisible(false);
      onComplete?.();
    }, 3200);

    return () => {
      clearTimeout(timerStep2);
      clearTimeout(timerStep3);
      clearTimeout(timerFadeOut);
      clearTimeout(timerComplete);
      clearTimeout(failSafeTimer);
    };
  }, [forceShow, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('travroidd_intro_seen', 'true');
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial accent glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-[#EAF3FF]/60">
        <div className="h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#0B5ED7]/15 to-[#38bdf8]/10 blur-3xl animate-pulse" />
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-slate-800"
      >
        Skip Intro
      </button>

      {/* Centerpiece: Official Travroidd Logo */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Logo Container with gentle flight glide animation */}
        <div
          className={`transition-all duration-700 ease-out transform ${
            step >= 2
              ? '-translate-y-2 translate-x-1.5 scale-100 rotate-1'
              : 'translate-y-4 scale-90 rotate-0 opacity-0'
          }`}
          style={{
            filter: 'drop-shadow(0 20px 30px rgba(11, 94, 215, 0.20))',
          }}
        >
          <img
            src="/assets/travroidd-logo.png"
            alt="Travroidd"
            className="h-32 w-32 sm:h-40 sm:w-40 object-contain select-none"
            loading="eager"
          />
        </div>

        {/* Brand Name Typography Reveal */}
        <div
          className={`mt-6 transition-all duration-700 ease-out ${
            step >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <h1 className="font-brand text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A2A66]">
            Travroidd
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#0B5ED7] uppercase">
            All India Travel Planner
          </p>
          <p className="font-script mt-2 text-xl sm:text-2xl text-slate-600">
            Pack your bags. Make your memory.
          </p>
        </div>
      </div>
    </div>
  );
};
