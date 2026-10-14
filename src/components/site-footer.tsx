import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Calendar, ExternalLink } from "lucide-react";
import { company } from "@/lib/catalog";
import { BookingModal } from "@/components/booking-modal";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy text-navy-foreground border-t border-white/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-12">
        {/* Brand Column */}
        <div className="sm:col-span-6 space-y-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/jjt-logo.png"
              alt="JJT Digital Innovative Inc."
              className="h-14 w-14 object-contain rounded-full bg-white p-1 shadow-md"
            />
            <div>
              <p className="font-display text-lg font-extrabold text-white tracking-tight leading-tight">
                {company.name}
              </p>
              <p className="eyebrow text-brand-soft text-[11px] font-bold mt-0.5">
                {company.tagline} • EST. {company.est}
              </p>
            </div>
          </div>
          <p className="max-w-md text-sm text-navy-foreground/80 leading-relaxed">
            Tailoring corporate merchandise, apparel, executive gifts, and end-to-end event
            management solutions to your unique requirements. From one custom item to a nationwide
            campaign.
          </p>

          {/* Social Media Links */}
          <div className="pt-2">
            <p className="eyebrow text-xs text-navy-foreground/60 mb-2.5">Connect With Us</p>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href={company.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="JJT Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-all duration-200 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:scale-110 shadow-xs"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={company.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="JJT LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-all duration-200 hover:bg-[#0A66C2] hover:scale-110 shadow-xs"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={company.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="JJT Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-all duration-200 hover:bg-[#1877F2] hover:scale-110 shadow-xs"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="sm:col-span-3 text-sm space-y-3">
          <p className="eyebrow text-navy-foreground/70">Navigation</p>
          <ul className="space-y-2 text-navy-foreground/80">
            <li>
              <Link to="/catalog" className="hover:text-white transition-colors">
                Product Catalog 2026
              </Link>
            </li>
            <li>
              <Link to="/build" className="hover:text-white transition-colors">
                Build Your Quote
              </Link>
            </li>
            <li>
              <BookingModal
                trigger={
                  <button
                    type="button"
                    className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                  >
                    Schedule Consultation
                  </button>
                }
              />
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="sm:col-span-3 text-sm space-y-3">
          <p className="eyebrow text-navy-foreground/70">Contact Details</p>
          <div className="space-y-2.5 text-navy-foreground/90 text-xs sm:text-sm">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand shrink-0" />
              <a href="mailto:sales@jjt-digital.com" className="hover:underline text-white font-medium">
                sales@jjt-digital.com
              </a>
            </p>
            <p className="flex items-start gap-2 text-xs">
              <Phone className="h-4 w-4 text-brand shrink-0 mt-0.5" />
              <span>
                +(63) 977 830 3388
              </span>
            </p>
            <p className="flex items-center gap-2 text-xs text-navy-foreground/80">
              <MapPin className="h-4 w-4 text-brand shrink-0" />
              Parañaque City, Metro Manila
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-navy-foreground/60 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto px-4 gap-2">
        <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        <p className="text-[11px] text-navy-foreground/40 font-mono tracking-wider">
          EST. {company.est} · MANILA, PHILIPPINES
        </p>
      </div>
    </footer>
  );
}
