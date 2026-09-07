export const homepage = {
  assets: {
    hero: "/images/preview/woodbay-kitchen-preview.png",
    factory: "/images/homepage/manufacturing-preview.png",
    interiors: "/images/homepage/furniture-decor-preview.png",
  },
  hero: {
    eyebrow: "Premium hardware. Elegant spaces.",
    title: "Elevate Every\nDetail of Your Home.",
    description:
      "Premium quality kitchen and wardrobe accessories crafted for elegance, durability and performance.",
  },
  trust: [
    {
      title: "Premium Quality",
      text: "Sourced from trusted manufacturing partners and facilities.",
    },
    { title: "Innovative Design", text: "Smart solutions for modern living." },
    {
      title: "Global Standards",
      text: "Tested for durability and reliability.",
    },
    {
      title: "Trusted by Experts",
      text: "Preferred by interior professionals.",
    },
  ],
  categories: [
    {
      title: "Kitchen Accessories",
      href: "/products/kitchen-accessories",
      description: "Precision accessories for effortless kitchens.",
      image: "/images/categories/kitchen-accessories.png",
    },
    {
      title: "Wardrobe Accessories",
      href: "/products/wardrobe-accessories",
      description: "Organised interiors, beautifully considered.",
      image: "/images/categories/wardrobe-accessories.png",
    },
    {
      title: "Pantry Solutions",
      href: "/products/kitchen-accessories",
      description: "Elevated access for everyday storage.",
      image: "/images/categories/pantry-solutions.png",
    },
    {
      title: "Pullout Solutions",
      href: "/products/kitchen-accessories",
      description: "Smart movement, refined function.",
      image: "/images/categories/pullout-solutions.png",
    },
    {
      title: "Corner Solutions",
      href: "/products/kitchen-accessories",
      description: "Every corner made useful.",
      image: "/images/categories/corner-solutions.png",
    },
    {
      title: "Hardware Fittings",
      href: "/products/kitchen-accessories",
      description: "Reliable details for lasting spaces.",
      image: "/images/categories/hardware-fittings.png",
    },
    {
      title: "Decor Products",
      href: "/products/decor",
      description: "Surfaces with architectural character.",
      image: "/images/categories/decor-products.png",
    },
    {
      title: "Smart Products",
      href: "/products/smart-products",
      description: "Intelligent comfort for contemporary living.",
      image: "/images/categories/smart-products.png",
    },
  ],
  featured: [
    {
      title: "Pantry Systems",
      href: "/products/kitchen-accessories/product/glass-pantry",
    },
    {
      title: "Pullout Systems",
      href: "/products/kitchen-accessories/product/bottle-pullout",
    },
    {
      title: "Corner Solutions",
      href: "/products/kitchen-accessories/product/corner-basket",
    },
    {
      title: "Wardrobe Organisers",
      href: "/products/wardrobe-accessories/product/wardrobe-trouser-rack",
    },
    {
      title: "Cabinet Hinges",
      href: "/products/kitchen-accessories/product/soft-close-hinge",
    },
    {
      title: "Tandem Boxes",
      href: "/products/kitchen-accessories/product/tandem-box-system",
    },
    {
      title: "Smart Sinks",
      href: "/products/smart-products/product/waterfall-sink",
    },
    {
      title: "Smart Furniture",
      href: "/products/smart-products/product/smart-furniture",
    },
  ],
  manufacturingFeatures: [
    "Quality Assurance",
    "Innovation Driven",
    "On-Time Delivery",
    "Pan India Distribution",
    "Dedicated Support",
  ],
  smart: [
    {
      title: "Smart Furniture",
      text: "Connected comfort for the way modern homes live.",
    },
    {
      title: "Smart Waterfall Sinks",
      text: "Functional innovation for contemporary kitchens.",
    },
  ],
  decor: [
    "Wallpaper",
    "PU Stone Panels",
    "Glass Mosaic Tiles",
    "3D PVC Panels",
    "Charcoal Louvers",
    "Lighting",
  ],
  projects: ["Kitchen", "Wardrobe", "Bedroom", "TV Unit", "Living Room"],
  // Keep figures hidden until verified by Woodbay. Labels preserve the future information architecture.
  capabilityLabels: [
    "Manufacturing Facility",
    "Warehouse & Distribution",
    "Product Innovation",
    "Skilled Team",
    "Dealer Network",
  ],
} as const;

export type HomepageHeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  mobilePosition: string;
  desktopPosition: string;
  cta: string;
  href: string;
  alt: string;
};

// Curated from the active, populated catalogue taxonomy on 2026-09-07.
// Furniture is included because it is a live Woodbay business division with
// its own design, outlet and factory-visit flows, rather than a catalogue SKU.
export const homepageHeroSlides: readonly HomepageHeroSlide[] = [
  {
    eyebrow: "Smart Kitchen",
    title: "Smarter Kitchens.\nBetter Living.",
    description:
      "Pantry, pullout, corner and sink systems designed around everyday life.",
    image: "/images/home-2/hero-interiors.png",
    mobilePosition: "64% center",
    desktopPosition: "62% center",
    cta: "Explore Kitchens",
    href: "/products/kitchen-wardrobe-accessories",
    alt: "Contemporary kitchen with integrated Woodbay storage solutions",
  },
  {
    eyebrow: "Wardrobe Solutions",
    title: "A Place for\nEverything.",
    description:
      "Wardrobe organisers, lifters, racks and storage that make space work harder.",
    image: "/images/categories/wardrobe-accessories.png",
    mobilePosition: "50% center",
    desktopPosition: "50% center",
    cta: "Explore Wardrobes",
    href: "/products/kitchen-wardrobe-accessories?subcategory=wardrobe-series",
    alt: "Walk-in wardrobe fitted with organised Woodbay storage accessories",
  },
  {
    eyebrow: "Smart Furniture",
    title: "Furniture That\nDoes More.",
    description:
      "Connected tables, adaptable desks and lift-up furniture for modern rooms.",
    image: "/images/home-2/hero-smart-living.png",
    mobilePosition: "67% center",
    desktopPosition: "62% center",
    cta: "Explore Smart Furniture",
    href: "/products/smart-furniture",
    alt: "Modern living room furnished with smart adaptable furniture",
  },
  {
    eyebrow: "Custom Furniture",
    title: "Made Around\nYour Space.",
    description:
      "Furniture designed to measure, supported by Woodbay's dedicated factory service.",
    image: "/images/home-2/hero-manufacturing.png",
    mobilePosition: "72% center",
    desktopPosition: "68% center",
    cta: "Explore Furniture",
    href: "/furniture",
    alt: "Woodbay furniture workshop displaying precision fittings and drawer systems",
  },
  {
    eyebrow: "Hardware Fittings",
    title: "Details Built\nto Perform.",
    description:
      "Hinges, lift-up systems and dependable fittings for furniture that lasts.",
    image: "/images/categories/hardware-fittings.png",
    mobilePosition: "58% center",
    desktopPosition: "57% center",
    cta: "Explore Hardware",
    href: "/products/hardware-fittings",
    alt: "Close view of Woodbay cabinet hinges and drawer hardware",
  },
  {
    eyebrow: "Aluminium Profiles",
    title: "Clean Lines.\nPrecise Finishes.",
    description:
      "Profiles, handles and frame systems for refined furniture and interiors.",
    image: "/images/products/aluminium-profile.webp",
    mobilePosition: "54% center",
    desktopPosition: "50% center",
    cta: "Explore Profiles",
    href: "/products/hardware-fittings?subcategory=aluminium-profiles",
    alt: "Selection of Woodbay aluminium furniture and interior profiles",
  },
  {
    eyebrow: "Home Decor",
    title: "Surfaces With\nCharacter.",
    description:
      "Wall finishes, panels, lighting and decor that give rooms their identity.",
    image: "/images/homepage/home-decor-category-v2.png",
    mobilePosition: "65% center",
    desktopPosition: "62% center",
    cta: "Explore Home Decor",
    href: "/products/home-decor",
    alt: "Layered Woodbay wall finishes, furniture and decorative lighting",
  },
  {
    eyebrow: "Mattresses",
    title: "Better Rest,\nThoughtfully Built.",
    description:
      "Pocket spring comfort designed to support restorative everyday sleep.",
    image: "/images/products/pocket-spring-mattresses.webp",
    mobilePosition: "54% center",
    desktopPosition: "50% center",
    cta: "Explore Mattresses",
    href: "/products/home-decor?subcategory=mattresses",
    alt: "Cutaway view of a Woodbay pocket spring mattress on a bed",
  },
] as const;
