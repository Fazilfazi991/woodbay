export const furniture = {
  hero: {
    eyebrow: "Factory Direct Furniture",
    title: "Design Your Own\nFurniture.",
    description:
      "Factory direct, custom made furniture built around your space, finish preferences and the way you live.",
  },
  categories: [
    "Kitchen",
    "Wardrobe",
    "Bedroom",
    "TV Unit",
    "Living Room",
    "Study / Home Office",
  ],
  benefits: [
    { title: "Factory Direct", text: "Direct consultation and manufacturing." },
    { title: "Custom Made", text: "Designed around your space." },
    {
      title: "Colours & Finishes",
      text: "Considered combinations for your project.",
    },
    {
      title: "Premium Materials",
      text: "Quality-focused materials and hardware.",
    },
    { title: "Made to Fit", text: "Furniture based on your requirements." },
    { title: "Factory Visit", text: "See the process before you decide." },
  ],
  process: [
    "Choose Furniture",
    "Choose Finish",
    "Choose Colours",
    "Share Dimensions",
    "Consult With Woodbay",
    "Manufacturing & Delivery",
  ],
  demoColours: [
    { name: "Walnut", hex: "#5b3a29" },
    { name: "Warm Ivory", hex: "#e9dfce" },
    { name: "Charcoal", hex: "#333431" },
    { name: "Sandstone", hex: "#b49b7b" },
  ] as const,
} as const;
