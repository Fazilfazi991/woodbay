export type NavigationItem = { label: string; href: string; children?: readonly { label: string; href: string }[] };
export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Home", href: "/" }, { label: "About", href: "/about" },
  { label: "Products", href: "/products", children: [{ label: "Kitchen Accessories", href: "/products/kitchen-accessories" }, { label: "Wardrobe Accessories", href: "/products/wardrobe-accessories" }, { label: "Decor Products", href: "/products/decor" }, { label: "Smart Products", href: "/products/smart-products" }] },
  { label: "Furniture", href: "/furniture" }, { label: "Services", href: "/services" }, { label: "Projects", href: "/projects" },
  { label: "Dealers", href: "/dealers", children: [{ label: "Find a Dealer", href: "/dealers" }, { label: "Become a Dealer", href: "/dealers/become-a-dealer" }] },
  { label: "Downloads", href: "/downloads" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/contact" },
] as const;
export const footerNavigation = { products: primaryNavigation[2].children ?? [], company: [{ label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Projects", href: "/projects" }, { label: "Blog", href: "/blog" }], dealers: primaryNavigation[6].children ?? [], support: [{ label: "Downloads", href: "/downloads" }, { label: "Contact", href: "/contact" }, { label: "Book Factory Visit", href: "/contact" }] } as const;
