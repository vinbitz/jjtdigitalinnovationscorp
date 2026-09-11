import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import workFsiSummit from "@/assets/showcase/work-fsi-executive-summit.jpg";
import workFsiDelegates from "@/assets/showcase/work-fsi-summit-delegates.jpg";
import workEcloudBooth from "@/assets/showcase/work-ecloudvalley-booth.jpg";
import workAkamaiJacket from "@/assets/showcase/work-akamai-jacket.jpg";
import workAwsJacket from "@/assets/showcase/work-aws-ecloud-jacket.jpg";
import workTrainocateBox from "@/assets/showcase/work-trainocate-box-set.jpg";
import workCorporateBox from "@/assets/showcase/work-corporate-box-set.jpg";
import workVipBoxes from "@/assets/showcase/work-vip-holiday-giftboxes.jpg";
import workLeatherSleeves from "@/assets/showcase/work-leather-sleeves.jpg";
import workLeatherKeychains from "@/assets/showcase/work-leather-keychains.jpg";
import workJacketsPackaging from "@/assets/showcase/work-jackets-packaging.jpg";

import { BookingModal } from "@/components/booking-modal";

export interface ShowcaseImage {
  id: string;
  src: string;
  alt: string;
}

/**
 * List of authentic project & production photos.
 * To add more pictures, simply import them and add an entry below!
 */
export const SHOWCASE_IMAGES: ShowcaseImage[] = [
  { id: "fsi-summit-stage", src: workFsiSummit, alt: "Production sample" },
  { id: "fsi-delegates", src: workFsiDelegates, alt: "Production sample" },
  { id: "ecloud-booth", src: workEcloudBooth, alt: "Production sample" },
  { id: "akamai-jacket", src: workAkamaiJacket, alt: "Production sample" },
  { id: "aws-ecloud-jacket", src: workAwsJacket, alt: "Production sample" },
  { id: "trainocate-box", src: workTrainocateBox, alt: "Production sample" },
  { id: "corporate-box", src: workCorporateBox, alt: "Production sample" },
  { id: "vip-giftboxes", src: workVipBoxes, alt: "Production sample" },
  { id: "leather-sleeves", src: workLeatherSleeves, alt: "Production sample" },
  { id: "leather-keychains", src: workLeatherKeychains, alt: "Production sample" },
  { id: "jackets-packaging", src: workJacketsPackaging, alt: "Production sample" },
];

export function EventsShowcase() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Keyboard navigation for full-screen lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev !== null ? (prev - 1 + SHOWCASE_IMAGES.length) % SHOWCASE_IMAGES.length : 0
        );
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev !== null ? (prev + 1) % SHOWCASE_IMAGES.length : 0
        );
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex]);

  return (
    <section className="relative overflow-hidden bg-stone-50/70 dark:bg-navy/40 border-y border-border py-8 sm:py-12">
      <style>{`
        @keyframes showcaseMarqueeAnim {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .showcase-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: showcaseMarqueeAnim 42s linear infinite;
        }
        .showcase-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Section Header (clean, concise, unlabelled photos) */}
      <div className="mx-auto max-w-6xl px-4 text-center space-y-1.5 mb-6 sm:mb-8">
        <p className="eyebrow text-brand font-extrabold uppercase tracking-widest text-[10px] sm:text-[11px]">
          Finished Work • Authentic Production Samples
        </p>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Our Work in Action
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Completed corporate merchandise, executive gift packaging, and event productions delivered nationwide.
        </p>
      </div>

      {/* Moving Line / Infinite Marquee Ribbon */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-stone-50 dark:from-navy/90 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-stone-50 dark:from-navy/90 to-transparent z-10" />

        {/* Marquee Track (duplicated for seamless continuous loop) */}
        <div className="showcase-marquee-track items-center gap-3 sm:gap-4 py-1">
          {[...SHOWCASE_IMAGES, ...SHOWCASE_IMAGES].map((img, idx) => {
            const originalIndex = idx % SHOWCASE_IMAGES.length;
            return (
              <button
                key={`${img.id}-${idx}`}
                type="button"
                onClick={() => setActiveImageIndex(originalIndex)}
                className="group relative h-36 sm:h-44 md:h-48 w-52 sm:w-64 md:w-72 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs hover:shadow-lg hover:border-brand/60 transition-all duration-200 cursor-pointer text-left focus:outline-hidden"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Subtle hover overlay hint with zero labels */}
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/15 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Helper note */}
      <p className="text-center text-[11px] text-muted-foreground mt-3 font-medium tracking-wide">
        Hover to pause • Click any photo to view in full resolution
      </p>

      {/* Fullscreen Lightbox Modal (Click to View Unlabeled Photo) */}
      {activeImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-colors cursor-pointer"
            aria-label="Close photo preview"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) =>
                prev !== null ? (prev - 1 + SHOWCASE_IMAGES.length) % SHOWCASE_IMAGES.length : 0
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((prev) =>
                prev !== null ? (prev + 1) % SHOWCASE_IMAGES.length : 0
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Centered high-resolution image container */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={SHOWCASE_IMAGES[activeImageIndex]?.src}
              alt={SHOWCASE_IMAGES[activeImageIndex]?.alt}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>

          {/* Counter pill */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full">
            {activeImageIndex + 1} / {SHOWCASE_IMAGES.length}
          </div>
        </div>
      )}

      {/* Consultation & Quote Action Strip */}
      <div className="mx-auto max-w-5xl px-4 mt-12 sm:mt-16">
        <div className="rounded-xl border border-brand/20 bg-gradient-to-br from-brand/5 via-transparent to-blue-500/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-foreground">
              Have an upcoming corporate event or custom gifting deadline?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              We provide free digital mockups, sample materials, and tiered volume pricing tailored to your schedule.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <BookingModal
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-sm bg-navy text-white px-4 py-2.5 font-display text-xs font-bold shadow-xs hover:bg-navy/90 cursor-pointer"
                >
                  <Calendar className="h-3.5 w-3.5 text-brand-soft" />
                  Book Consultation
                </button>
              }
            />
            <Link
              to="/build"
              className="inline-flex items-center gap-1.5 rounded-sm bg-brand text-brand-foreground px-4 py-2.5 font-display text-xs font-bold shadow-xs hover:bg-brand/90"
            >
              Start Quote <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Re-export as ClientShowcase so existing imports continue to work without breaking
export { EventsShowcase as ClientShowcase };
