export type CartVariant = {
  id: string;
  name: string;
  sku: string | null;
  dimension: string | null;
  size: string | null;
  finish: string | null;
  colour: string | null;
  material: string | null;
};

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  productCode: string | null;
  categoryName: string | null;
  detailPath: string;
  image: { src: string; alt: string } | null;
};

export type CartLine = {
  lineId: string;
  product: CartProduct;
  variant: CartVariant | null;
  quantity: number;
};

export type AddCartItem = {
  product: CartProduct;
  variant?: CartVariant | null;
  quantity?: number;
};
