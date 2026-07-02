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

export declare const templatiumSdk: {
  init(key: string): void;
  ecommerce: {
    client: {
      get(): Promise<any>;
    };
    product: {
      get(id:string): Promise<any>;
    };
    productCategory: {
      get(): Promise<any>;
    };
  };
};
