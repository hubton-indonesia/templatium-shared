export class ApiError extends Error {
  status: string;
  data: unknown;
}

export function handleCall<T>(
  fn: () => Promise<unknown>
): Promise<{data: T; metadata: unknown[]}>;

export function requireAuth(token?: string | null): string;

export function withAuth<T>(
  token: string | null | undefined,
  fn: (token: string) => Promise<T>
): Promise<T>;

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
  sold_count: number;
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
  enable_paypal: boolean;
  usd_rate: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: { url: string; path: string; filename: string } | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  posts?: BlogPost[];
}

export interface TeamMember {
  id: string;
  name: string;
  title: string | null;
  image: { url: string; path: string | null; filename: string } | null;
  bio: string | null;
  order_column: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  [key: string]: unknown;
}

export interface ClientData {
  id: string;
  name: string;
  slug: string;
  logo: { url: string; path: string } | null;
  status: string;
  package: string;
  enabled_couriers: string;
  free_shipping_threshold: number | null;
  shipping_origin_city_id: string;
  payment_gateway_provider: string;
  payment_gateway_client_id: string;
  enable_paypal: boolean;
  enable_otp: boolean;
  usd_markup_type: string;
  usd_markup_value: number | null;
  created_at: string;
  updated_at: string;
}

export interface CurrencyDetectData {
  country_code: string;
  recommended_gateway: string;
  recommended_currency: string;
  usd_rate: number | null;
  enable_paypal: boolean;
  usd_markup_type: string;
  usd_markup_value: number | null;
}

export interface CustomerData {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
}

export interface AuthVerifyResponseData {
  customer: CustomerData;
  access_token: string;
  token_expires_at: string;
  retroactive_orders_linked: number;
}

export interface CustomerProfileData {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
}

export interface SubscriptionResponseData {
  client_id: string;
  subscription_order_id: string;
  order_number: string;
  payment_url: string;
  invoice_page_url: string;
}

export interface ProductCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export interface ShippingProvince {
  province_id: string;
  province: string;
}

export interface ShippingCity {
  city_id: string;
  province_id: string;
  type: string;
  city_name: string;
}

export interface ShippingDistrict {
  district_id: string;
  district_name: string;
}

export interface ShippingSubdistrict {
  subdistrict_id: string;
  subdistrict_name: string;
}

export interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  billing_address: string | null;
  shipping_courier: string | null;
  shipping_service: string | null;
  shipping_province_id: string | null;
  shipping_city_id: string | null;
  shipping_district_id: string | null;
  shipping_subdistrict_id: string | null;
  shipping_province_name: string | null;
  shipping_city_name: string | null;
  shipping_district_name: string | null;
  shipping_subdistrict_name: string | null;
  postal_code: string | null;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string | null;
  payment_id: string | null;
  payment_url: string | null;
  airway_bill: string | null;
  currency: string;
  exchange_rate: number | null;
  total_usd: number | null;
  items: string;
  created_at: string;
}

export declare const templatiumSdk: {
  init(key: string): void;
  setBaseUrl(url: string): void;
  setExtraHeaders(headers: Record<string, string>): void;
  setEnvironment(env: "staging" | "live"): void;
  blog: {
    get(slug?: string): Promise<any>;
  };
  category: {
    get(slug?: string): Promise<any>;
  };
  contact: {
    submit(body: {
      name: string;
      message: string;
      extra_data?: string[] | null;
    }): Promise<any>;
  };
  teamMember: {
    get(): Promise<any>;
  };
  testimonial: {
    get(): Promise<any>;
  };
  subscription: {
    register(body: {
      client_name: string;
      package: "basic" | "business" | "premium";
      customer_name: string;
      customer_email: string;
      password: string;
      client_slug?: string | null;
      customer_phone?: string | null;
    }): Promise<any>;
  };
  ecommerce: {
    visit: {
      log(): Promise<any>;
    };
    client: {
      get(): Promise<any>;
    };
    currency: {
      detect(): Promise<any>;
    };
    auth: {
      sendOtp(body: { email: string }): Promise<any>;
      verifyOtp(body: {
        email: string;
        otp?: string | null;
        name?: string | null;
        phone?: string | null;
      }): Promise<any>;
    };
    customer: {
      profile: {
        get(token: string): Promise<any>;
        update(body: { name?: string | null; phone?: string | null }, token: string): Promise<any>;
      };
      orders: {
        get(token: string): Promise<any>;
      };
    };
    product: {
      get(id?: string): Promise<any>;
    };
    productCategory: {
      get(): Promise<any>;
    };
    productCollection: {
      get(slug?: string): Promise<any>;
    };
    shipping: {
      provinces: {
        get(): Promise<any>;
      };
      cities: {
        get(provinceId: string): Promise<any>;
      };
      districts: {
        get(cityId: string): Promise<any>;
      };
      subdistricts: {
        get(districtId: string): Promise<any>;
      };
      cost: {
        calculate(body: {
          destination_district_id: string;
          weight: number;
        }): Promise<any>;
      };
    };
    cart: {
      createOrRetrieve(body: { session_id?: string | null; user_id?: string | null }): Promise<any>;
      get(cartId: string): Promise<any>;
      addItem(cartId: string, body: { product_variant_id: string; quantity?: number | null }): Promise<any>;
      updateItem(cartId: string, itemId: string, body: { quantity: number }): Promise<any>;
      removeItem(cartId: string, itemId: string): Promise<any>;
    };
    order: {
      store(body: {
        cart_id: string;
        customer_email: string;
        shipping_address: string;
        customer_name?: string | null;
        customer_phone?: string | null;
        billing_address?: string | null;
        payment_method?: string | null;
        payment_id?: string | null;
        shipping_courier?: string | null;
        shipping_service?: string | null;
        shipping_province_id?: string | null;
        shipping_city_id?: string | null;
        shipping_district_id?: string | null;
        shipping_subdistrict_id?: string | null;
        shipping_province_name?: string | null;
        shipping_city_name?: string | null;
        shipping_district_name?: string | null;
        shipping_subdistrict_name?: string | null;
        postal_code?: string | null;
        currency?: string | null;
      }, customerToken?: string): Promise<any>;
      get(idOrNumber: string): Promise<any>;
      capturePaypal(orderId: string, body: { paypal_order_id: string }): Promise<any>;
    };
  };
};
