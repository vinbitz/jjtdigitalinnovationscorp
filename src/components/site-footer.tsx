import { Link } from "@tanstack/react-router";
import { company } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2">
        <div>
          <p className="font-display text-lg font-extrabold">{company.name}</p>
          <p className="eyebrow mt-1 text-navy-foreground/70">{company.tagline}</p>
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/80">
            Tailoring corporate marketing products and event solutions to your unique
            requirements.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow text-navy-foreground/70">Get in touch</p>
          <ul className="mt-3 space-y-1.5 text-navy-foreground/90">
            <li>{company.phone}</li>
            <li>{company.email}</li>
            <li>{company.location}</li>
          </ul>
          <Link
            to="/admin"
            className="mt-6 inline-block text-xs text-navy-foreground/50 hover:text-navy-foreground"
          >
            Staff sign in
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-navy-foreground/60">
        &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
      </div>
    </footer>
  );
}
