# JJT Digital Innovative Inc.

> Corporate Marketing, Bespoke Merchandising & Event Solutions Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38b2ac.svg)](https://tailwindcss.com/)

Official web portal and custom quote configuration engine for **JJT Digital Innovative Inc.** (EST. 2020), Parañaque City, Metro Manila, Philippines.

---

## Architecture & Features

### Client-Facing Portal
- **2026 Corporate Catalog (`/catalog`)**: Real-time product directory across 70+ product lines including apparel, drinkware, tech gifts, rain gear, bags, and luxury corporate gift sets.
- **Custom Campaign Configurator (`/build`)**: 4-phase interactive procurement flow for volume inquiries, custom branding specs, apparel size distributions, and event dates.
- **Executive Consultation Scheduling**: Integrated discovery call booking with instant Google Calendar and ICS calendar invitations.
- **Enterprise Partner Showcase**: Animated moving marquee highlighting collaborations with leading brands (AWS, Cisco, Nutanix, OutSystems, VST ECS, Freshworks, Akamai, SolarWinds, FWD Insurance, Landbank, Hotel Sogo, Astrotel, Trainocate, and M-Security).
- **Direct Catalog Distribution**: Immediate PDF brochure retrieval with one-click download.

### Internal Management Console (`/admin`)
- **Lead Pipeline**: Comprehensive tracking of incoming quote requests, event dates, contact briefs, and uploaded vector branding assets.
- **Stock & Inventory Control**: Real-time stock counts and minimum order quantity (MOQ) configuration across all SKUs.
- **Status Workflow**: Stage transitions (`New Lead` &rarr; `Contacted` &rarr; `Quoted` &rarr; `Won` &rarr; `Lost`) with automated status filters.

---

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with TanStack Router
- **Runtime**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Backend & Persistence**: Supabase (PostgreSQL, Storage, Row-Level Security)
- **Asset Processing**: Sharp image optimization pipeline
- **Deployment**: Nitro (Cloudflare / Node)

---

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/vinbitz/jjtdigitalinnovationscorp.git
cd jjtdigitalinnovationscorp

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`.

### Production Build

```bash
# Compile and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

---

## Company Contact

**JJT Digital Innovative Inc.**  
Parañaque City, Metro Manila, Philippines  
- **Email**: [sales@jjt-digital.com](mailto:sales@jjt-digital.com)  
- **Phone**: +(63) 917-143-5890 / +(63) 968-231-4096  
- **Socials**: [Instagram](https://www.instagram.com/jjtdigitalinnovative.agency) • [LinkedIn](https://www.linkedin.com/company/jjt-digital-innovative-agency) • [Facebook](https://www.facebook.com/jjtdigitalinnovative)
