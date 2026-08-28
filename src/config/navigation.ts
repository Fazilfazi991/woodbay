export type NavigationItem = {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
};

export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      {
        label: "Kitchen & Wardrobe Accessories",
        href: "/products/kitchen-wardrobe-accessories",
      },
      {
        label: "Hardware Fittings & Profiles",
        href: "/products/hardware-fittings",
      },
      { label: "Smart Furniture", href: "/products/smart-furniture" },
      { label: "Home Decor", href: "/products/home-decor" },
    ],
  },
  { label: "Furniture", href: "/furniture" },
  { label: "Projects", href: "/projects" },
  {
    label: "Dealers",
    href: "/dealers",
    children: [
      { label: "Find a Dealer", href: "/dealers" },
      { label: "Become a Dealer", href: "/dealers/become-a-dealer" },
    ],
  },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNavigation = {
  products: primaryNavigation[2].children ?? [],
  company: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
  ],
  dealers: primaryNavigation[6].children ?? [],
  support: [
    { label: "Verify Voucher", href: "/redeem" },
    { label: "Contact", href: "/contact" },
    { label: "Book Factory Visit", href: "/furniture/factory-visit" },
  ],
} as const;
