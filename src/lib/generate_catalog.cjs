const fs = require('fs');

const oldFile = "C:\\\\Users\\\\Marvin Barrios\\\\.gemini\\\\antigravity\\\\scratch\\\\jjtdigitalinnovationscorp\\\\src\\\\lib\\\\catalog.ts";

const content = fs.readFileSync(oldFile, 'utf8');
const bundlesStart = content.indexOf("export const bundles: Bundle[] = [");
const servicesStart = content.indexOf("export const services = [");

const bundlesStr = content.substring(bundlesStart, servicesStart);
const servicesStr = content.substring(servicesStart);

const newContent = `import pTshirt from "@/assets/p-tshirt.jpg";
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
import pRaincoat from "@/assets/p-raincoat.jpg";
import pUmbrella from "@/assets/p-umbrella.jpg";
import pGiftset from "@/assets/p-giftset.jpg";

import setA from "@/assets/products/set-a.jpg";
import setB from "@/assets/products/set-b.jpg";
import setC from "@/assets/products/set-c.jpg";
import setD from "@/assets/products/set-d.jpg";
import setE from "@/assets/products/set-e.jpg";
import setF from "@/assets/products/set-f.jpg";
import setG from "@/assets/products/set-g.jpg";
import setH from "@/assets/products/set-h.jpg";
import setI from "@/assets/products/set-i.jpg";
import setJ from "@/assets/products/set-j.jpg";
import setK from "@/assets/products/set-k.jpg";
import setL from "@/assets/products/set-l.jpg";

import eventBooth from "@/assets/products/event-booth.jpg";
import eventLedWall from "@/assets/products/event-led-wall.jpg";
import eventRegistration from "@/assets/products/event-registration.jpg";
import eventPhotobooth from "@/assets/products/event-photobooth.jpg";
import eventTechCrew from "@/assets/products/event-tech-crew.jpg";
import eventHost from "@/assets/products/event-host.jpg";
import eventCorporateSetup from "@/assets/products/event-corporate-setup.jpg";
import eventDigitalKiosk from "@/assets/products/event-digital-kiosk.jpg";
import eventIdBadge from "@/assets/products/event-id-badge.jpg";
import eventCertificateHolder from "@/assets/products/event-certificate-holder.jpg";

import kitDailyCommute from "@/assets/products/kit-daily-commute.jpg";
import kitMobileWork from "@/assets/products/kit-mobile-work.jpg";
import kitExecutiveDesk from "@/assets/products/kit-executive-desk.jpg";
import kitTravelSmart from "@/assets/products/kit-travel-smart.jpg";
import kitWfh from "@/assets/products/kit-wfh.jpg";
import kitEventEssentials from "@/assets/products/kit-event-essentials.jpg";
import kitTechStarter from "@/assets/products/kit-tech-starter.jpg";
import kitEverydayCarry from "@/assets/products/kit-everyday-carry.jpg";
import kitPremiumWelcome from "@/assets/products/kit-premium-welcome.jpg";

import luxuryBundle0 from "@/assets/products/luxury-bundle-0.jpg";
import luxuryBundle1 from "@/assets/products/luxury-bundle-1.jpg";
import luxuryBundle2 from "@/assets/products/luxury-bundle-2.jpg";
import luxuryBundle3 from "@/assets/products/luxury-bundle-3.jpg";
import luxuryBundle4 from "@/assets/products/luxury-bundle-4.jpg";
import luxuryBundle5 from "@/assets/products/luxury-bundle-5.jpg";
import luxuryBundle6 from "@/assets/products/luxury-bundle-6.jpg";
import luxuryBundle7 from "@/assets/products/luxury-bundle-7.jpg";
import luxuryBundle8 from "@/assets/products/luxury-bundle-8.jpg";

import kitAnniversary from "@/assets/products/kit-anniversary.jpg";
import kitAppreciation from "@/assets/products/kit-appreciation.jpg";
import kitTechEvents from "@/assets/products/kit-tech-events.jpg";
import kitConferences from "@/assets/products/kit-conferences.jpg";
import kitFunRuns from "@/assets/products/kit-fun-runs.jpg";
import kitConcerts from "@/assets/products/kit-concerts.jpg";
import kitAwardsNight from "@/assets/products/kit-awards-night.jpg";
import kitNewYears from "@/assets/products/kit-new-years.jpg";

import ecoCutlery from "@/assets/products/eco-cutlery.jpg";
import ecoLunchbox from "@/assets/products/eco-lunchbox.jpg";
import techSpeaker from "@/assets/products/tech-speaker.jpg";
import techUsb from "@/assets/products/tech-usb.jpg";
import techWirelessCharger from "@/assets/products/tech-wireless-charger.jpg";

import itemBambooBox from "@/assets/products/item-bamboo-box.jpg";
import itemBambooCutlery from "@/assets/products/item-bamboo-cutlery.jpg";
import itemCertHolder from "@/assets/products/item-cert-holder.jpg";
import itemChargingMousepad from "@/assets/products/item-charging-mousepad.jpg";
import itemCoolingTowel from "@/assets/products/item-cooling-towel.jpg";
import itemDigitalClock from "@/assets/products/item-digital-clock.jpg";
import itemDryBag from "@/assets/products/item-dry-bag.jpg";
import itemFlashlight from "@/assets/products/item-flashlight.jpg";
import itemGlassBento from "@/assets/products/item-glass-bento.jpg";
import itemJacket from "@/assets/products/item-jacket.jpg";
import itemKraftBox from "@/assets/products/item-kraft-box.jpg";
import itemLanyard from "@/assets/products/item-lanyard.jpg";
import itemLaptopStand from "@/assets/products/item-laptop-stand.jpg";
import itemMetalPen from "@/assets/products/item-metal-pen.jpg";
import itemMiniFan from "@/assets/products/item-mini-fan.jpg";
import itemMouse from "@/assets/products/item-mouse.jpg";
import itemMultiCable from "@/assets/products/item-multi-cable.jpg";
import itemNeckPillow from "@/assets/products/item-neck-pillow.jpg";
import itemPlaque from "@/assets/products/item-plaque.jpg";
import itemPocketMirror from "@/assets/products/item-pocket-mirror.jpg";
import itemPoloLongsleeve from "@/assets/products/item-polo-longsleeve.jpg";
import itemPolo from "@/assets/products/item-polo.jpg";
import itemPowerbank10k from "@/assets/products/item-powerbank-10k.jpg";
import itemRaincoat from "@/assets/products/item-raincoat.jpg";
import itemRubberMousepad from "@/assets/products/item-rubber-mousepad.jpg";
import itemSandoJersey from "@/assets/products/item-sando-jersey.jpg";
import itemSocks from "@/assets/products/item-socks.jpg";
import itemSpeakerAuthentic from "@/assets/products/item-speaker.jpg";
import itemSwivelUsb from "@/assets/products/item-swivel-usb.jpg";
import itemTissueCaddy from "@/assets/products/item-tissue-caddy.jpg";
import itemToiletryBag from "@/assets/products/item-toiletry-bag.jpg";
import itemUmbrellaMaster from "@/assets/products/item-umbrella-master.jpg";
import itemWirelessPad from "@/assets/products/item-wireless-pad.jpg";

export const STANDARD_COLORS = [
  "Black",
  "White",
  "Beige",
  "Blue",
  "Brown",
  "Red",
  "Green",
  "Violet",
  "Yellow",
  "Pink",
];

export const JACKET_COLORS = [
  "Black",
  "White",
  "Beige",
  "Brown",
  "Red",
  "Blue",
];

export type ProductVariants = {
  types?: string[];
  brands?: string[];
  sizes?: string[];
  specialSizes?: string[];
  colors?: string[];
  printMethods?: string[];
};

export type Product = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  moq: number;
  apparel?: boolean;
  specs?: string;
  category?: string;
  priceTier?: "under_500" | "under_1000" | "executive";
  variants?: ProductVariants;
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    id: "popular",
    name: "Popular Items & Event Essentials",
    tagline: "High-impact brand-ready essentials tailored for corporate gifting and brand activations.",
    products: [
      {
        id: "tactical-led-flashlight",
        name: "Tactical Rechargeable LED Flashlight",
        blurb: "Heavy-duty aerospace aluminum LED torch with high-lumen output, adjustable zoom focus beam, strobe/SOS modes, and USB-C rechargeable battery. Precision laser engraved logo.",
        image: itemFlashlight,
        moq: 25,
        priceTier: "under_500",
        specs: "USB-C Rechargeable • 800 Lumens • Zoomable • IPX6 Waterproof",
        variants: {
          types: [
            "Standard Compact USB Torch (Under ₱500)",
            "Heavy-Duty Tactical Zoom Power Torch (Under ₱1,000)",
          ],
          colors: ["Black", "Gunmetal Gray", "Navy Blue"],
        },
      },
      {
        id: "metal-pen",
        name: "Personalized Laser-Engraved Metal Pen",
        blurb: "Luxury executive metal ballpoint pen with precision laser engraving. Gift box ready.",
        image: itemMetalPen,
        moq: 50,
        priceTier: "under_500",
        specs: "Multiple barrel finishes • Blue or black ink",
      },
      {
        id: "custom-notebook",
        name: "Custom Corporate Executive Notebook",
        blurb: "Debossed or foil-stamped luxury cover, satin ribbon bookmark, pen loop, and 100gsm ink-proof cream paper. Tailor your binding style, cover texture, and branding.",
        image: pNotebook,
        moq: 30,
        priceTier: "under_500",
        specs: "Sizes: A5 & B5 • 5 Binding Styles • 8 Colors",
        variants: {
          types: [
            "A5 Hardbound Executive Notebook (Gold-Foil / Debossed)",
            "A5 Soft-Touch Leather Strap Notebook",
            "A5 Magnetic Clasp Moleskine-Style Notebook",
            "B5 Executive Hardcover Conference Journal",
            "A5 Spiral-Bound Hardcover Desk Planner",
          ],
          sizes: ["A5 (14.8 x 21 cm)", "B5 (17.6 x 25 cm)"],
          colors: ["Black", "Brown", "Navy Blue", "Beige", "Gunmetal Gray", "Red", "Blue", "Green"],
          printMethods: ["Blind Debossing", "Gold Foil Hot Stamping", "Silver Foil Stamping", "Full-Color UV Print"],
        },
      },
      {
        id: "custom-coffee-mug",
        name: "Custom Ceramic & Glass Coffee Mugs",
        blurb: "High-grade ceramic and tempered glass coffee mugs. Choose classic porcelain, magic heat-activated color reveal, or modern frosted glass with your corporate emblem.",
        image: pMug,
        moq: 30,
        priceTier: "under_500",
        specs: "11oz to 14oz • Dishwasher Safe Sublimation",
        variants: {
          types: [
            "Classic Gloss Porcelain Ceramic Mug (11oz)",
            "Magic Heat-Activated Color Reveal Mug (11oz)",
            "Tempered Frosted Glass Coffee Mug (11oz)",
            "Double-Layered Pastel Ceramic Mug with Sip Lid (400ml)",
          ],
          colors: ["White", "Black", "Navy Blue", "Clear / Frosted"],
          printMethods: ["Full-Wrap Dishwasher-Safe Sublimation", "Silk-Screen Print"],
        },
      },
      {
        id: "pullup-banner",
        name: "Roll-Up Pull-Up Display Banner",
        blurb: "High-resolution printed banner on heavy vinyl with retractable aluminum stand and carry bag.",
        image: pBanner,
        moq: 1,
        priceTier: "under_1000",
        specs: "2.75 x 6.5 ft (85 x 200 cm) • Heavy aluminum base",
      },
      {
        id: "pins-stickers",
        name: "Custom Button Pins & Vinyl Stickers",
        blurb: "2.25\\" round pinback buttons with matte or glitter finish, plus die-cut and kiss-cut sheet stickers.",
        image: pLanyard,
        moq: 100,
        priceTier: "under_500",
        specs: "2.25\\" Pins • Waterproof vinyl kiss/die cut",
      },
      {
        id: "lanyard-id",
        name: "Premium ID Lanyard",
        blurb: "High-quality corporate lanyards tailored for your brand, available with different attachments and safety features.",
        image: itemLanyard,
        moq: 100,
        priceTier: "under_500",
        specs: "Multiple widths and attachments available • Full-color sublimation",
        variants: {
          types: [
            "1\\" G-Hook",
            "0.75\\" Adjustable",
            "0.5\\" Slim",
            "Side Release Buckle"
          ]
        }
      },
      {
        id: "corrugated-box",
        name: "Custom Branded Gift Box",
        blurb: "Sturdy custom packaging boxes with one-color or full-color print. Custom sizes available for kits and giveaways.",
        image: itemKraftBox,
        moq: 30,
        priceTier: "under_500",
        specs: "Multiple custom dimensions • Perfect for kits",
        variants: {
          types: [
            "Corrugated Kraft",
            "White Board",
            "Magnetic Lid",
            "Sliding Drawer"
          ]
        }
      },
      {
        id: "plaques-trophies",
        name: "Custom Recognition Plaques & Trophies",
        blurb: "Laser-engraved acrylic, crystal, or wooden award plaques with UV color accents.",
        image: itemPlaque,
        moq: 5,
        specs: "Beveled acrylic / crystal / solid mahogany",
      },
      {
        id: "diploma-holders",
        name: "Diploma & Certificate Holders",
        blurb: "Padded leatherette certificate folders with gold satin corner ribbons and hot foil stamping.",
        image: itemCertHolder,
        moq: 30,
        specs: "Letter / A4 size • Gold corner tabs",
      },
      {
        id: "qr-nfc-badges",
        name: "Smart QR & NFC Event Badges",
        blurb: "Durable PVC badge with embedded contactless NFC chip and custom printed dynamic QR code.",
        image: pLanyard,
        moq: 50,
        specs: "CR80 credit card size or oversize 4x6 badge",
      },
    ],
  },
  {
    id: "bags",
    name: "Bags & Carry Essentials",
    tagline: "Practical, stylish everyday carry from page 6 & 18 of the catalog.",
    products: [
      {
        id: "canvas-tote",
        name: "Canvas Tote Bag",
        blurb: "High-quality cotton canvas totes perfect for corporate giveaways, conferences, and daily use.",
        image: pCanvasTote,
        moq: 50,
        specs: "Durable natural cotton canvas",
        variants: {
          types: [
            "Rope Handle 14oz",
            "Standard 12x14",
            "Wide Conference"
          ]
        }
      },
      {
        id: "ecobag",
        name: "Ecobag",
        blurb: "Eco-friendly non-woven bags ideal for budget-friendly high-volume distributions and events.",
        image: pEcoBag,
        moq: 100,
        specs: "80gsm - 100gsm non-woven • Assorted vibrant colors",
        variants: {
          types: [
            "Flat Non-Woven",
            "Gusseted Non-Woven",
            "Vertical Conference",
            "Horizontal"
          ]
        }
      },
      {
        id: "drawstring-bag",
        name: "Polyester Sports Drawstring Bag",
        blurb: "Water-resistant polyester with reinforced PU corners and thick braided drawstrings. Ideal for sports and fun runs.",
        image: pDrawstring,
        moq: 50,
        specs: "14 x 18 inches • 210D water-resistant polyester",
      },
      {
        id: "jute-bag",
        name: "Eco Jute Bag with Padded Rope Handles",
        blurb: "Natural organic burlap jute tote with laminated interior and soft padded cotton handles.",
        image: pCanvasTote,
        moq: 50,
        specs: "Natural jute • Waterproof interior coating",
      },
      {
        id: "paper-bag",
        name: "Branded Paper Shopping Bag with Rope",
        blurb: "High-grade kraft or white cardboard with reinforced bottom card and matching rope handles.",
        image: pEcoBag,
        moq: 100,
        specs: "250gsm art card / kraft • Matte/gloss lamination",
      },
      {
        id: "canvas-pouch",
        name: "Canvas Organizer Pouch",
        blurb: "Versatile canvas pouches for packing tumblers, stationery, or cosmetics.",
        image: pDrawstring,
        moq: 50,
        specs: "Multiple sizes and closures",
        variants: {
          types: [
            "String Drawstring",
            "Zippered Organizer"
          ]
        }
      },
      {
        id: "laptop-bag",
        name: "Executive Padded Laptop Briefcase (15.6\\")",
        blurb: "Padded shockproof compartment fits laptops up to 15.6\\", luggage strap, and removable shoulder strap.",
        image: pLaptopBag,
        moq: 25,
        specs: "Fits up to 15.6\\" • Water-resistant nylon/poly",
      },
      {
        id: "sling-bag",
        name: "Compact Versatile Crossbody Sling Bag",
        blurb: "Modern ergonomic chest/shoulder sling with multi-zipper compartments and quick-access pockets.",
        image: pLaptopBag,
        moq: 30,
        specs: "Adjustable ambidextrous strap • USB pass-through",
      },
      {
        id: "waist-bag",
        name: "Adjustable Sports Waist Bag / Fanny Pack",
        blurb: "Slim-profile waist pack with heavy-duty buckle, zippered front pocket, and concealed back wallet slot.",
        image: pDrawstring,
        moq: 30,
        specs: "High-density nylon • Reflective zipper pulls",
      },
      {
        id: "dry-bag",
        name: "Waterproof Roll-Top Dry Bag",
        blurb: "Heavy-duty 500D PVC tarpaulin with welded watertight seams and adjustable shoulder sling.",
        image: itemDryBag,
        moq: 30,
        specs: "10L or 20L capacity • Floats safely if dropped in water",
      },
      {
        id: "organizer-toiletry",
        name: "Hanging Travel Wash & Toiletry Bag",
        blurb: "Fold-out multi-compartment travel organizer with 360-degree swivel hanging hook and waterproof mesh pockets.",
        image: itemToiletryBag,
        moq: 30,
        specs: "Waterproof Oxford fabric • 4 separate zip sections",
      },
    ],
  },
  {
    id: "apparel",
    name: "Apparel & Headwear",
    tagline: "Quality corporate apparel from page 7, 8 & 19. Full brand and size guide available.",
    products: [
      {
        id: "tshirt",
        name: "Combed Cotton Round-Neck T-Shirt",
        blurb: "100% premium combed cotton, ultra-soft handfeel. Available in top retail and wholesale brands with custom DTF, silkscreen, or embroidered logos.",
        image: pTshirt,
        moq: 24,
        apparel: true,
        priceTier: "under_500",
        specs: "Sizes: XS to 5XL • 7 Top Brands Available",
        variants: {
          types: ["100% Combed Cotton"],
          brands: [
            "Uniqlo",
            "Collesione",
            "Gildan",
            "Softex Brand",
            "Blue Corner",
            "Whistler",
            "Winner",
          ],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          specialSizes: ["3XL", "4XL", "5XL"],
          colors: STANDARD_COLORS,
          printMethods: ["DTF (Direct to Film)", "Silkscreen Print", "Embroidery"],
        },
      },
      {
        id: "drifit-shirt",
        name: "Dri-Fit Performance Sports Shirt",
        blurb: "Breathable moisture-wicking athletic polyester. Fast-drying performance fabric tailored for company fun runs, team building, and outdoor events.",
        image: pTshirt,
        moq: 24,
        apparel: true,
        priceTier: "under_500",
        specs: "Sizes: XS to 5XL • DTF or Sublimation",
        variants: {
          types: [
            "Simple - DTF Print",
            "Simple - Sublimation Print",
            "Winner - DTF Print",
            "Winner - Sublimation Print",
          ],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          specialSizes: ["3XL", "4XL", "5XL"],
          colors: STANDARD_COLORS,
          printMethods: ["DTF Print", "Full Sublimation Print"],
        },
      },
      {
        id: "polo",
        name: "Corporate Pique Polo Shirt",
        blurb: "Classic collared corporate polo with ribbed cuffs. Available in top retail & corporate brands with high-definition embroidery.",
        image: itemPolo,
        moq: 24,
        apparel: true,
        priceTier: "under_1000",
        specs: "Sizes: XS to 5XL • 7 Top Brands Available",
        variants: {
          brands: [
            "Uniqlo",
            "Gildan",
            "Lifeline",
            "Softex Brand",
            "Blue Corner",
            "Whistler",
            "Winner",
          ],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          specialSizes: ["3XL", "4XL", "5XL"],
          colors: STANDARD_COLORS,
          printMethods: ["High-Density Embroidery", "DTF Print"],
        },
      },
      {
        id: "jacket-collection",
        name: "Corporate Jacket & Outerwear Collection",
        blurb: "Tailored executive jackets, hoodies, and vests for company uniforms, client gifts, and air-conditioned offices. Select your preferred silhouette and embroidery/DTF branding.",
        image: itemJacket,
        moq: 15,
        apparel: true,
        priceTier: "under_1000",
        specs: "Sizes: XS to 5XL • 6 Outerwear Styles Available",
        variants: {
          types: [
            "Hoodie with zipper - with DTF or Embroidered logo",
            "Hoodie without zipper",
            "Leather Jacket",
            "Corporate Jacket",
            "Vest Jacket",
            "Customized Jacket - client preferred design",
          ],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          specialSizes: ["3XL", "4XL", "5XL"],
          colors: JACKET_COLORS,
          printMethods: ["High-Density Embroidery", "DTF Print", "Debossed Leather Patch"],
        },
      },
      {
        id: "long-sleeves",
        name: "Long Sleeves Corporate Shirt / Jersey",
        blurb: "Tailored long sleeve shirt or drifit crewneck for sun protection and air-conditioned offices.",
        image: itemPoloLongsleeve,
        moq: 24,
        apparel: true,
        priceTier: "under_500",
        specs: "Sizes: XS to 5XL • Ribbed cuffs",
        variants: {
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          specialSizes: ["3XL", "4XL", "5XL"],
          colors: STANDARD_COLORS,
        },
      },
      {
        id: "athletic-sando",
        name: "Athletic Sando / Singlet",
        blurb: "High-performance sleeveless tops for sports festivals, marathons, and training.",
        image: itemSandoJersey,
        moq: 24,
        apparel: true,
        priceTier: "under_500",
        specs: "Sizes: XS to 3XL • Ultra-light dry-fit",
        variants: {
          types: [
            "Running Singlet (Racerback/Standard)",
            "V-Neck Sleeveless Top with Collar"
          ],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          colors: STANDARD_COLORS,
        },
      },
      {
        id: "headwear",
        name: "Custom Headwear",
        blurb: "Branded headwear options for casual everyday use, outdoor events, or company uniforms.",
        image: pCap,
        moq: 24,
        specs: "Adjustable sizing • Premium embroidery",
        variants: {
          types: [
            "5-Panel Baseball Cap",
            "Bucket Hat",
            "Sun Visor"
          ]
        }
      },
      {
        id: "custom-socks",
        name: "Custom Jacquard Knit Crew Socks",
        blurb: "Cushioned sole cotton crew socks with custom jacquard-knitted brand patterns and logo.",
        image: itemSocks,
        moq: 50,
        specs: "80% Combed cotton, 17% Poly, 3% Spandex",
      },
      {
        id: "sports-towel",
        name: "Quick-Dry Sports Cooling Towel",
        blurb: "Soft absorbent microfiber towel for sports events, marathons, and gym kits.",
        image: itemCoolingTowel,
        moq: 50,
        specs: "30 x 80 cm or 35 x 100 cm • Sublimated edge-to-edge",
      },
    ],
  },
  {
    id: "tech",
    name: "Tech & Gadgets",
    tagline: "High-perceived-value electronic gifts from page 9 & 17 of the catalog.",
    products: [
      {
        id: "powerbank-10k",
        name: "Slim Fast-Charging Power Bank (10,000mAh)",
        blurb: "Ultra-slim lithium-polymer power bank with dual USB + Type-C ports and digital LED percentage display.",
        image: itemPowerbank10k,
        moq: 25,
        specs: "10,000mAh • 22.5W Fast Charge • Full UV Print",
      },
      {
        id: "phone-laptop-stand",
        name: "Foldable Aluminum Phone & Laptop Stand",
        blurb: "Ergonomic multi-angle riser that elevates devices to eye level, folds completely flat for travel.",
        image: itemLaptopStand,
        moq: 30,
        specs: "Anodized aluminum alloy • Anti-slip silicone pads",
      },
      {
        id: "bluetooth-speaker",
        name: "Portable Fabric Bluetooth Speaker",
        blurb: "Crisp 360-degree sound with woven fabric acoustic grille and convenient silicone lanyard strap.",
        image: itemSpeakerAuthentic,
        moq: 25,
        specs: "5W Output • 6 Hours Playtime • Bluetooth 5.3",
      },
      {
        id: "mini-fan",
        name: "Rechargeable Handheld & Desk Mini Fan",
        blurb: "Whisper-quiet 3-speed brushless motor with detachable desktop stand and USB-C rechargeable battery.",
        image: itemMiniFan,
        moq: 50,
        specs: "2000mAh Battery • 4-8 Hours run time",
      },
      {
        id: "wireless-mouse",
        name: "Ergonomic Silent Wireless Optical Mouse",
        blurb: "Quiet-click 2.4GHz wireless mouse with sleek matte finish and custom printed brand logo.",
        image: itemMouse,
        moq: 30,
        specs: "1600 DPI • USB Nano receiver • Auto-sleep power saving",
      },
      {
        id: "mousepad",
        name: "Custom Mouse Pad",
        blurb: "Enhance your desk setup with our premium branded mousepads. Available in standard rubber or integrated Qi wireless charging.",
        image: itemRubberMousepad,
        moq: 50,
        specs: "Anti-slip base • Smooth tracking surface",
        variants: {
          types: [
            "Rubber Standard (18 x 22 cm)",
            "Qi Wireless Charging Pad (15W)"
          ]
        }
      },
      {
        id: "multi-cable-case",
        name: "3-in-1 Retractable Multi-Charging Cable",
        blurb: "Compact circular roll case housing Type-C, Lightning, and Micro-USB cables in one neat package.",
        image: itemMultiCable,
        moq: 50,
        specs: "Extendable up to 1.2m • 3A fast charging",
      },
      {
        id: "bamboo-cable-organizer",
        name: "Multifunctional Bamboo Cable Organizer Box",
        blurb: "Real natural bamboo wooden folding case with built-in wireless charging coil, cables, and pen stand.",
        image: itemBambooBox,
        moq: 20,
        specs: "Natural organic bamboo • Multi-connector cable set",
      },
      {
        id: "swivel-usb",
        name: "Swivel Metal USB Flash Drive (32GB / 64GB)",
        blurb: "Classic 360-degree aluminum rotating shield protects the USB connector. Laser-engraved or silkscreened.",
        image: itemSwivelUsb,
        moq: 50,
        specs: "High-speed USB 3.0 • 32GB or 64GB capacity",
      },
      {
        id: "wireless-charger-pad",
        name: "Ultra-Slim Qi Wireless Charger (15W)",
        blurb: "Minimalist circular induction charging pad with breathing LED ring indicator and non-slip feet.",
        image: itemWirelessPad,
        moq: 25,
        specs: "15W Max Output • Aluminum base with acrylic face",
      },
      {
        id: "digital-clock-nightlight",
        name: "Digital Clock & Night Light",
        blurb: "Modern desktop accessories that combine utility with illuminated branding for your workspace or bedside.",
        image: itemDigitalClock,
        moq: 25,
        specs: "LED glow • Elegant design",
        variants: {
          types: [
            "Digital Desk Clock",
            "Acrylic LED Night Light"
          ]
        }
      },
    ],
  },
  {
    id: "rain",
    name: "Rain Gear & Care Items",
    tagline: "Weather-ready essentials made for Philippine conditions from page 10 & 20.",
    products: [
      {
        id: "custom-umbrella",
        name: "Custom Corporate Umbrella",
        blurb: "High-grade weather-ready corporate umbrella. Choose handle style, frame size, and corporate color with precision silk-screen or heat-transfer branding.",
        image: itemUmbrellaMaster,
        moq: 30,
        priceTier: "under_500",
        specs: "Sizes: Mini & Standard • 10 Colors Available",
        variants: {
          types: [
            "Classic J-Handle (23\\")",
            "J-Handle Golf Umbrella (30\\")",
            "Double Canopy Vented Golf (30\\")",
            "Premium Automatic Foldable (3-Fold)",
            "30-Inch Heavy-Duty VIP Golf",
          ],
          sizes: ["Mini", "Standard"],
          colors: STANDARD_COLORS,
          printMethods: ["Silk-Screen Print", "Heat Transfer Full Color"],
        },
      },
      {
        id: "raincoat-hooded",
        name: "Hooded Reusable Waterproof Raincoat",
        blurb: "Thick eco-friendly EVA waterproof coat with snap button closures, drawstring hood, and custom logo print.",
        image: itemRaincoat,
        moq: 50,
        specs: "0.15mm thick EVA • Unisex one-size fit",
      },
      {
        id: "spray-bottle",
        name: "Pocket Alcohol Mist Spray Bottle (50ml)",
        blurb: "Refillable credit card or pocket mist spray bottle with leak-proof atomizing pump.",
        image: pPen,
        moq: 100,
        specs: "50ml capacity • Silicone sleeve & carabiner optional",
      },
      {
        id: "humidifier-desk",
        name: "Desktop Ultrasonic Mist Humidifier",
        blurb: "Quiet cool-mist personal humidifier with continuous/intermittent spray modes and warm LED nightlight.",
        image: pJpTumbler,
        moq: 30,
        specs: "300ml water capacity • USB powered",
      },
      {
        id: "tissue-box-caddy",
        name: "Multi-Compartment Desk Tissue Box & Caddy",
        blurb: "Minimalist desktop tissue dispenser featuring built-in side slots for mobile phones, remotes, and pens.",
        image: itemTissueCaddy,
        moq: 30,
        specs: "Matte ABS body with natural bamboo wood lid",
      },
      {
        id: "neck-pillow",
        name: "Memory Foam Ergonomic Travel Neck Pillow",
        blurb: "High-density molded memory foam with 360-degree chin support and removable breathable velour cover.",
        image: itemNeckPillow,
        moq: 30,
        specs: "Contoured ergonomic curve • Washable zip cover",
      },
      {
        id: "pocket-mirror",
        name: "Dual Folding Compact Pocket Mirror",
        blurb: "Sleek metallic pocket mirror with 1x true view and 2x magnification mirror inside.",
        image: itemPocketMirror,
        moq: 50,
        specs: "Round 70mm diameter • PU leather or metallic casing",
      },
    ],
  },
  {
    id: "drinkware",
    name: "Eco-Friendly Line & Tumblers",
    tagline: "Insulated thermal drinkware and eco essentials from page 11 & 16 of the catalog.",
    products: [
      {
        id: "custom-thermal-tumbler",
        name: "Custom Stainless Steel Vacuum Insulated Tumbler",
        blurb: "Food-grade 304 double-wall vacuum insulation. Keeps drinks ice cold for 24h or steaming hot for 12h. Select your silhouette, capacity, and precision laser engraving or full-color UV wrap.",
        image: pJpTumbler,
        moq: 25,
        priceTier: "under_500",
        specs: "Sizes: 350ml to 1.2L • 7 Silhouettes • 10 Colors",
        variants: {
          types: [
            "Japanese Travel Flask with Ergonomic Loop Handle (350ml)",
            "Minimalist Cylinder Vacuum Thermal Flask (500ml)",
            "Heavy-Duty Explorer Sport Thermos with Handle (800ml)",
            "40oz Oversized Grip Handle Tumbler with Straw (1.2L)",
            "Double-Wall Curved Stainless Egg Tumbler (360ml)",
            "Desktop Coffee Mug with D-Handle & Splash Lid (350ml)",
            "Natural Sustainable Bamboo Wrapped Stainless Flask (450ml)",
          ],
          sizes: ["350ml (12oz)", "500ml (17oz)", "800ml (27oz)", "1.2L (40oz)"],
          colors: STANDARD_COLORS,
          printMethods: ["Precision Laser Engraving", "Full-Wrap UV Print", "Silkscreen Logo"],
        },
      },
      {
        id: "custom-ceramic-glass-mug",
        name: "Custom Ceramic & Glass Coffee Mugs",
        blurb: "High-grade ceramic and tempered glass mugs. Select classic white porcelain, magic heat-activated color reveal, or modern frosted glass with your corporate emblem.",
        image: pMug,
        moq: 30,
        priceTier: "under_500",
        specs: "11oz to 14oz • Dishwasher Safe Sublimation",
        variants: {
          types: [
            "Classic Gloss Porcelain Ceramic Mug (11oz)",
            "Magic Heat-Activated Color Reveal Mug (11oz)",
            "Tempered Frosted Glass Coffee Mug (11oz)",
            "Double-Layered Pastel Ceramic Mug with Sip Lid (400ml)",
          ],
          colors: ["White", "Black", "Navy Blue", "Clear / Frosted"],
          printMethods: ["Full-Wrap Dishwasher-Safe Sublimation", "Silk-Screen Print"],
        },
      },
      {
        id: "bamboo-cutlery",
        name: "Bamboo Cutlery Set with Bamboo Straw & Pouch",
        blurb: "Full reusable dining set: wooden spoon, fork, knife, chopsticks, bamboo straw, and wire brush in custom canvas pouch.",
        image: itemBambooCutlery,
        moq: 50,
        specs: "Natural bamboo utensils • Cotton tie pouch",
      },
      {
        id: "lunch-box-bamboo",
        name: "Glass Bento Lunch Box with Bamboo Lid",
        blurb: "Oven & microwave-safe borosilicate glass container topped with a solid bamboo cutting board lid and elastic band.",
        image: itemGlassBento,
        moq: 30,
        specs: "1000ml glass base • Solid bamboo lid",
      },
    ],
  },
  {
    id: "event-management",
    name: "Custom Event Solutions",
    tagline: "End-to-end event production and technical solutions from planning to full on-site production.",
    products: [
      {
        id: "booth-installation",
        name: "Small / Big Booth Installation & Fabrication",
        blurb: "Full exhibition booth setup: modular aluminum framing, laminated wall panels, display counters, and overhead signage.",
        image: eventBooth,
        moq: 1,
        specs: "Custom 2x2m, 3x3m, or multi-island exhibition booths",
      },
      {
        id: "led-walls",
        name: "Indoor / Outdoor LED Wall Stage Setup",
        blurb: "High-definition P2.6 / P3.9 modular LED video wall with rigging, ground support, and video processors.",
        image: eventLedWall,
        moq: 1,
        specs: "Custom dimensions • Live switcher and technician",
      },
      {
        id: "registration-system",
        name: "Event Registration System & Automated Website",
        blurb: "Custom branded registration microsite, automated QR confirmation passes, badge printing setup, and on-site crew.",
        image: eventRegistration,
        moq: 1,
        specs: "Web platform + QR scanner equipment + trained manpower",
      },
      {
        id: "photo-booth",
        name: "Photo Booth & 360 Video Booth Support",
        blurb: "Interactive open-air photo booth or 360-degree rotating video platform with instant magnetic photo prints and custom frames.",
        image: eventPhotobooth,
        moq: 1,
        specs: "Unlimited 4R prints or magnetic strips • Custom overlay",
      },
      {
        id: "tech-documentation",
        name: "AV Tech Crew & Video Documentation",
        blurb: "Professional videography and photography team for event recaps, high-res photo albums, and multi-camera live switching.",
        image: eventTechCrew,
        moq: 1,
        specs: "Full coverage • Same-day edit (SDE) available",
      },
      {
        id: "event-host",
        name: "Professional Bilingual Event Emcee / Host",
        blurb: "Experienced English and Filipino hosts for corporate conferences, awards galas, team buildings, and sports fests.",
        image: eventHost,
        moq: 1,
        specs: "Script consultation and full event program hosting",
      },
      {
        id: "pubmat-design",
        name: "Full Pubmat Designing & Collateral Templates",
        blurb: "Complete graphic design suite: event key visuals, stage backdrop artwork, social media countdown pubmats, and program brochures.",
        image: eventDigitalKiosk,
        moq: 1,
        specs: "High-res vector assets and print-ready files",
      },
      {
        id: "corporate-setups",
        name: "Corporate Venue & Stage Staging",
        blurb: "Comprehensive venue dressing, lighting fixtures, floral/corporate table centerpieces, and stage backdrop fabrication.",
        image: eventCorporateSetup,
        moq: 1,
        specs: "Bespoke production based on venue floorplan",
      },
    ],
  },
];

` + bundlesStr + servicesStr;

fs.writeFileSync(oldFile, newContent);
console.log("Done");
