# Custom Campaign Builder

Create a website where it will show all the products in mockup and the customer can tick or input if how many they need, also place the logo they want to place, and date of event, and others think of what to put, also the services they want to available, and i will show in the admin. Also they can set up the calendar for meeting, also they can get the brochure in the landing page



1. The Client-Facing Website (Frontend)

​A. The Landing Page & Brochure

​Hero Section: A strong tagline (like "Driving Innovation") and a brief intro about tailoring solutions for unique requirements.  

​Instant Download: A prominent, above-the-fold button to download the new 2026 Corporate Marketing Product Catalog.  

​Call to Action: A "Build Your Quote" or "Start Your Campaign" button that leads to the interactive catalog.

​B. The Interactive "Build Your Campaign" Flow

Instead of just a static list, treat this like an e-commerce checkout flow, but for a custom quote.

​Step 1: Choose Products & Quantities: * Display mockup images of your categories (Apparel, Bags, Tech, Eco-Friendly, etc.).  

​When a user clicks a product (e.g., a Canvas Tote Bag or a Bamboo Tumbler), a modal pops up where they can type in the quantity needed.  

​Step 2: Add Custom Services:

​Provide a checkbox list of your non-physical services.

​Options should include Event Management (planning, booths, LED walls, hosts) and Marketing Services (brand materials, digital support).  

​Step 3: Customization & Event Details:

​Logo Upload: A drag-and-drop zone for them to upload their company logo (accept .png, .svg, .ai).

​Event Date: A calendar date picker so you know their timeline.

​Occasion/Purpose: A dropdown asking what this is for (e.g., Holidays, Employee Recognition, Conferences).  

​Budget Range: A field to select their target budget to help you tailor the final proposal.  

​Step 4: Book a Meeting:

​Embed a scheduling tool (like Calendly or Google Calendar Appointment Scheduling) directly on the success page so they can immediately lock in a discovery call after submitting their request.

​2. The Admin Dashboard (Backend)

​You will need a clean, protected route (e.g., /admin) to manage these incoming leads.

​Lead Overview: A table listing all submissions with columns for Client Name, Company, Event Date, and Status (New, Reviewed, Quoted).

​Request Details: Clicking a lead opens a detailed view showing:

​The exact itemized list and quantities they selected.

​The services they ticked.

​A direct download link for their uploaded logo file.

​Their budget and occasion notes.  

​Action Buttons: Quick buttons to mark the lead as "Contacted" or to generate a baseline PDF quote.

​3. "Other Things to Put" (Recommended Additions)

​To make the site convert better and feel more complete, consider adding these elements:

​A "Bundles" Section: Some clients don't want to pick individual items. Create a quick-select option for your curated Corporate Gift Sets (like the Daily Commute Kit or Executive Desk Kit).  

​Minimum Order Quantity (MOQ) Warnings: If certain items (like custom jackets or tech gadgets) require a minimum order, display that dynamically when they enter a quantity.

​Apparel Size Breakdown: If they select apparel (like Polo Shirts or Hoodies), reveal an optional text box where they can paste their size breakdown (e.g., 10 M, 15 L, 5 XL).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://jjtdigitalinnovationscorp.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6e3ef3d6-50dc-44de-8d9c-715fb6e5ef2d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
