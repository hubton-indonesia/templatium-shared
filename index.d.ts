export function formatIDR(value: number, multiplier?: number): string;
export function formatUSD(value: number, multiplier?: number): string;

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image?: string | null;
}

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  image_url: string;
  gallery_urls: string[];
  has_variants: boolean;
  price_range: {
    min: number;
    max: number;
    original_min: number;
    original_max: number;
  };
  total_stock: number;
  enable_paypal: boolean;
  usd_rate: number;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  variants: Array<{
    id: string;
    sku: string | null;
    gtin: string | null;
    price: number;
    price_usd: number;
    discount_price: number;
    discount_price_usd: number;
    currency_rate: number;
    stock: number;
    image: string;
    combination: string | null;
    is_default: boolean;
  }>;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_variant_id: string;
  product_name: string;
  product_image: string;
  variant_combination: string | null;
  price: number;
  price_usd: number;
  quantity: number;
  stock_available: number;
}

export interface CartData {
  id: string;
  session_id: string | null;
  user_id: string | null;
  items: CartItem[];
  subtotal: number;
  subtotal_usd: number;
  currency: string;
  exchange_rate: number | null;
  created_at: string;
  updated_at: string;
}

export declare const templatiumSdk: {
  init(key: string): void;
  ecommerce: {
    client: {
      get(): Promise<any>;
    };
    product: {
      get(id?: string): Promise<any>;
    };
    productCategory: {
      get(): Promise<any>;
    };
    cart: {
      createOrRetrieve(body: { session_id?: string | null; user_id?: string | null }): Promise<any>;
      get(cartId: string): Promise<any>;
      addItem(cartId: string, body: { product_variant_id: string; quantity?: number | null }): Promise<any>;
      updateItem(cartId: string, itemId: string, body: { quantity: number }): Promise<any>;
      removeItem(cartId: string, itemId: string): Promise<any>;
    };
  };
};
