import pTshirt from "@/assets/p-tshirt.jpg";
import pPolo from "@/assets/p-polo.jpg";
import pHoodie from "@/assets/p-hoodie.jpg";
import pJacket from "@/assets/p-jacket.jpg";
import pCap from "@/assets/p-cap.jpg";
import pCanvasTote from "@/assets/p-canvas-tote.jpg";
import pDrawstring from "@/assets/p-drawstring.jpg";
import pLaptopBag from "@/assets/p-laptop-bag.jpg";
import pEcoBag from "@/assets/p-eco-bag.jpg";
import pJpTumbler from "@/assets/p-jp-tumbler.jpg";
import pBambooTumbler from "@/assets/p-bamboo-tumbler.jpg";
import pMug from "@/assets/p-mug.jpg";
import pPowerbank from "@/assets/p-powerbank.jpg";
import pWirelessCharger from "@/assets/p-wireless-charger.jpg";
import pMousepad from "@/assets/p-mousepad.jpg";
import pNotebook from "@/assets/p-notebook.jpg";
import pPen from "@/assets/p-pen.jpg";
import pLanyard from "@/assets/p-lanyard.jpg";
import pBanner from "@/assets/p-banner.jpg";
import pUmbrella from "@/assets/p-umbrella.jpg";
import pRaincoat from "@/assets/p-raincoat.jpg";
import pGiftset from "@/assets/p-giftset.jpg";

export type Product = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  moq: number;
  apparel?: boolean;
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    id: "apparel",
    name: "Apparel & Uniforms",
    tagline: "Shirts, polos and jackets built for teams and events.",
    products: [
      {
        id: "tshirt",
        name: "Cotton Round-Neck Shirt",
        blurb: "Soft combed cotton, silkscreen or DTF print.",
        image: pTshirt,
        moq: 24,
        apparel: true,
      },
      {
        id: "polo",
        name: "Pique Corporate Polo",
        blurb: "Embroidered logo, collar and cuff options.",
        image: pPolo,
        moq: 24,
        apparel: true,
      },
      {
        id: "hoodie",
        name: "Zip-Up Hoodie",
        blurb: "Fleece-lined, ideal for company anniversaries.",
        image: pHoodie,
        moq: 20,
        apparel: true,
      },
      {
        id: "jacket",
        name: "Corporate Windbreaker",
        blurb: "Water-resistant shell with embroidered branding.",
        image: pJacket,
        moq: 20,
        apparel: true,
      },
      {
        id: "cap",
        name: "Structured Baseball Cap",
        blurb: "Six-panel cap with 3D or flat embroidery.",
        image: pCap,
        moq: 24,
      },
    ],
  },
  {
    id: "bags",
    name: "Bags & Totes",
    tagline: "Everyday carry that keeps your logo in circulation.",
    products: [
      {
        id: "canvas-tote",
        name: "Canvas Tote Bag",
        blurb: "Heavy canvas, large print area.",
        image: pCanvasTote,
        moq: 50,
      },
      {
        id: "drawstring",
        name: "Drawstring Bag",
        blurb: "Lightweight giveaway favourite for fun runs.",
        image: pDrawstring,
        moq: 50,
      },
      {
        id: "laptop-bag",
        name: "Laptop Messenger Bag",
        blurb: "Padded sleeve, executive-gift quality.",
        image: pLaptopBag,
        moq: 25,
      },
      {
        id: "eco-bag",
        name: "Non-Woven Eco Bag",
        blurb: "Budget-friendly bulk option for conferences.",
        image: pEcoBag,
        moq: 100,
      },
    ],
  },
  {
    id: "drinkware",
    name: "Eco-Friendly Drinkware",
    tagline: "Tumblers and mugs people actually keep using.",
    products: [
      {
        id: "jp-tumbler",
        name: "Japanese Tumbler with Handle",
        blurb: "Double-wall stainless, laser-engraved logo.",
        image: pJpTumbler,
        moq: 50,
      },
      {
        id: "bamboo-tumbler",
        name: "Bamboo Stainless Tumbler",
        blurb: "Natural bamboo wrap, premium eco pick.",
        image: pBambooTumbler,
        moq: 50,
      },
      {
        id: "mug",
        name: "Ceramic Mug 11oz",
        blurb: "Full-colour sublimation print.",
        image: pMug,
        moq: 50,
      },
    ],
  },
  {
    id: "tech",
    name: "Tech & Gadgets",
    tagline: "High-perceived-value gifts for clients and executives.",
    products: [
      {
        id: "powerbank",
        name: "Slim Power Bank 10,000mAh",
        blurb: "UV-printed logo, gift box included.",
        image: pPowerbank,
        moq: 25,
      },
      {
        id: "wireless-charger",
        name: "Wireless Charging Pad",
        blurb: "15W fast charge, matte finish.",
        image: pWirelessCharger,
        moq: 25,
      },
      {
        id: "mousepad",
        name: "Desk Mouse Pad",
        blurb: "Full-surface print, non-slip base.",
        image: pMousepad,
        moq: 50,
      },
    ],
  },
  {
    id: "office",
    name: "Office & Event Essentials",
    tagline: "Everything the registration table needs.",
    products: [
      {
        id: "notebook",
        name: "Hardbound Notebook",
        blurb: "Debossed or foil-stamped cover.",
        image: pNotebook,
        moq: 50,
      },
      {
        id: "pen",
        name: "Metal Pen with Gift Box",
        blurb: "Laser-engraved, ideal for VIP kits.",
        image: pPen,
        moq: 50,
      },
      {
        id: "lanyard",
        name: "ID Lanyard & Holder",
        blurb: "Woven or printed, with metal hook.",
        image: pLanyard,
        moq: 100,
      },
      {
        id: "banner",
        name: "Roll-Up Banner Stand",
        blurb: "Aluminium stand with carry bag.",
        image: pBanner,
        moq: 1,
      },
    ],
  },
  {
    id: "rain",
    name: "Rain Gear",
    tagline: "Made for the Philippine weather calendar.",
    products: [
      {
        id: "umbrella",
        name: "Auto-Open Umbrella",
        blurb: "Windproof frame, panel printing.",
        image: pUmbrella,
        moq: 50,
      },
      {
        id: "raincoat",
        name: "Hooded Raincoat",
        blurb: "Reusable, print or heat-transfer logo.",
        image: pRaincoat,
        moq: 50,
      },
    ],
  },
];

export type Bundle = {
  id: string;
  name: string;
  blurb: string;
  contents: string[];
  image: string;
  moq: number;
};

export const bundles: Bundle[] = [
  {
    id: "onboarding-kit",
    name: "New Hire Onboarding Kit",
    blurb: "Welcome new employees with a complete branded set.",
    contents: ["Cotton shirt", "Hardbound notebook", "Metal pen", "ID lanyard"],
    image: pGiftset,
    moq: 25,
  },
  {
    id: "event-giveaway",
    name: "Event Giveaway Pack",
    blurb: "High-volume pack for conferences and activations.",
    contents: ["Eco bag", "Ceramic mug", "Drawstring bag", "Cap"],
    image: pEcoBag,
    moq: 100,
  },
  {
    id: "executive-gift",
    name: "Executive Gift Set",
    blurb: "Premium boxed set for clients and partners.",
    contents: ["Bamboo tumbler", "Hardbound notebook", "Metal pen", "Rigid gift box"],
    image: pGiftset,
    moq: 20,
  },
];

export const services = [
  {
    id: "event-management",
    name: "Event Management",
    blurb: "Concept, suppliers, program flow and on-site coordination.",
  },
  {
    id: "marketing-services",
    name: "Marketing Services",
    blurb: "Campaign planning, social media and content production.",
  },
  {
    id: "graphic-design",
    name: "Graphic Design & Layout",
    blurb: "Logo adaptation, mockups and print-ready artwork.",
  },
  {
    id: "photo-video",
    name: "Photo & Video Coverage",
    blurb: "Event documentation, product shots and reels.",
  },
  {
    id: "printing-signage",
    name: "Printing & Signage",
    blurb: "Tarpaulins, backdrops, stickers and booth panels.",
  },
  {
    id: "logistics",
    name: "Packing & Nationwide Delivery",
    blurb: "Kitting, individual packing and shipping across PH.",
  },
];

export const occasions = [
  "Company Anniversary",
  "Christmas / Year-End Party",
  "Product Launch",
  "Conference / Summit",
  "Trade Fair / Expo",
  "Employee Onboarding",
  "Client Appreciation",
  "Fun Run / Sports Fest",
  "Team Building",
  "Other",
];

export const budgetRanges = [
  "Under ₱50,000",
  "₱50,000 – ₱150,000",
  "₱150,000 – ₱300,000",
  "₱300,000 – ₱500,000",
  "₱500,000 – ₱1,000,000",
  "Above ₱1,000,000",
];

export const apparelSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export const allProducts: Product[] = categories.flatMap((c) => c.products);

export function findProduct(id: string) {
  return allProducts.find((p) => p.id === id);
}

export const company = {
  name: "JJT Digital Innovative Inc.",
  tagline: "Driving Innovation",
  phone: "+63 917-143-5890",
  email: "jjtdigitalinnovative@gmail.com",
  location: "Parañaque City, Metro Manila",
};
