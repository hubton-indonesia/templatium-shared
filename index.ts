export { formatIDR, formatUSD } from "./format-currency.js"

const DEFAULT_API_URL = "https://templatium-cms.secure-staging.com/api"
let apiUrl: string = DEFAULT_API_URL

function p(path: string) { return `${apiUrl}${path}` }
let extraHeaders: Record<string, string> = {}

export class ApiError extends Error {
  status: string
  data: unknown

  constructor(message: string, status: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export async function handleCall<T>(fn: () => Promise<unknown>): Promise<{data: T; metadata: unknown[]}> {
  const res = await fn()
  if ((res as any).status !== 'success') {
    throw new ApiError(
      (res as any).message ?? 'API error',
      (res as any).status ?? 'error',
      (res as any).data,
    )
  }
  const data = (res as any).data
  const metadata: unknown[] = (res as any).metadata ?? []
  if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
    return { data: data.items as T, metadata }
  }
  return { data: data as T, metadata }
}

export function requireAuth(token?: string | null): string {
  if (!token) throw new ApiError('Authentication required', 'auth_required')
  return token
}

export function withAuth<T>(token: string | null | undefined, fn: (token: string) => Promise<T>): Promise<T> {
  return fn(requireAuth(token))
}

let apiKey: string | null = null

async function apiFetch(url: string, method: string = "GET", body?: unknown, token?: string | null, opts?: { customerToken?: string }) {
  if (!apiKey && !extraHeaders['X-Checkout-API-Key']) {
    throw new Error('SDK not initialized. Call templatiumSdk.init(key) first.')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (extraHeaders['X-Checkout-API-Key']) {
    Object.assign(headers, extraHeaders)
  } else {
    if (!apiKey) throw new Error('SDK not initialized. Call templatiumSdk.init(key) first.')
    headers['X-API-KEY'] = apiKey
    Object.assign(headers, extraHeaders)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (opts?.customerToken) {
    headers['X-Customer-Token'] = opts.customerToken
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const templatiumSdk = {
  init(key: string) { apiKey = key },
  setBaseUrl(url: string) { apiUrl = url },
  setExtraHeaders(headers: Record<string, string>) { extraHeaders = headers },

  blog: {
    get(slug?: string) {
      return apiFetch(slug ? `${p('/blog')}/${slug}` : p('/blog'))
    },
  },
  category: {
    get(slug?: string) {
      return apiFetch(slug ? `${p('/categories')}/${slug}` : p('/categories'))
    },
  },
  contact: {
    submit(body: {
      name: string
      message: string
      extra_data?: string[] | null
    }) {
      return apiFetch(p('/contact'), "POST", body)
    },
  },
  teamMember: {
    get() { return apiFetch(p('/teams')) },
  },
  testimonial: {
    get() { return apiFetch(p('/testimonials')) },
  },
  subscription: {
    register(body: {
      client_name: string
      package: "basic" | "business" | "premium"
      customer_name: string
      customer_email: string
      password: string
      client_slug?: string | null
      customer_phone?: string | null
    }) {
      return apiFetch(p('/subscriptions'), "POST", body)
    },
  },
  ecommerce: {
    client: {
      get() { return apiFetch(p('/ecommerce/client')) },
    },
    currency: {
      detect() { return apiFetch(p('/ecommerce/currency/detect')) },
    },
    auth: {
      sendOtp(body: { email: string }) {
        return apiFetch(p('/ecommerce/auth/send-otp'), "POST", body)
      },
      verifyOtp(body: {
        email: string
        otp?: string | null
        name?: string | null
        phone?: string | null
      }) {
        return apiFetch(p('/ecommerce/auth/verify-otp'), "POST", body)
      },
    },
    customer: {
      profile: {
        get(token: string) { return apiFetch(p('/ecommerce/customer/profile'), "GET", undefined, token) },
        update(body: { name?: string | null; phone?: string | null }, token: string) {
          return apiFetch(p('/ecommerce/customer/profile'), "PUT", body, token)
        },
      },
      orders: {
        get(token: string) { return apiFetch(p('/ecommerce/customer/orders'), "GET", undefined, token) },
      },
    },
    product: {
      get(id?: string) {
        return apiFetch(id ? `${p('/ecommerce/products')}/${id}` : p('/ecommerce/products'))
      },
    },
    productCategory: {
      get() { return apiFetch(p('/ecommerce/categories')) },
    },
    productCollection: {
      get(slug?: string) {
        return apiFetch(slug ? `${p('/ecommerce/collections')}/${slug}` : p('/ecommerce/collections'))
      },
    },
    shipping: {
      provinces: {
        get() { return apiFetch(p('/ecommerce/shipping/provinces')) },
      },
      cities: {
        get(provinceId: string) { return apiFetch(`${p('/ecommerce/shipping/cities')}?province_id=${provinceId}`) },
      },
      districts: {
        get(cityId: string) { return apiFetch(`${p('/ecommerce/shipping/districts')}?city_id=${cityId}`) },
      },
      subdistricts: {
        get(districtId: string) { return apiFetch(`${p('/ecommerce/shipping/subdistricts')}?subdistrict_id=${districtId}`) },
      },
      cost: {
        calculate(body: {
          destination_district_id: string
          weight: number
        }) {
          return apiFetch(p('/ecommerce/shipping/cost'), "POST", body)
        },
      },
    },
    cart: {
      createOrRetrieve(body: { session_id?: string | null; user_id?: string | null }) {
        return apiFetch(p('/ecommerce/cart'), "POST", body)
      },
      get(cartId: string) { return apiFetch(`${p('/ecommerce/cart')}/${cartId}`) },
      addItem(cartId: string, body: { product_variant_id: string; quantity?: number | null }) {
        return apiFetch(`${p('/ecommerce/cart')}/${cartId}/items`, "POST", body)
      },
      updateItem(cartId: string, itemId: string, body: { quantity: number }) {
        return apiFetch(`${p('/ecommerce/cart')}/${cartId}/items/${itemId}`, "PATCH", body)
      },
      removeItem(cartId: string, itemId: string) {
        return apiFetch(`${p('/ecommerce/cart')}/${cartId}/items/${itemId}`, "DELETE")
      },
    },
    order: {
      store(body: {
        cart_id: string
        customer_email: string
        shipping_address: string
        customer_name?: string | null
        customer_phone?: string | null
        billing_address?: string | null
        payment_method?: string | null
        payment_id?: string | null
        shipping_courier?: string | null
        shipping_service?: string | null
        shipping_province_id?: string | null
        shipping_city_id?: string | null
        shipping_district_id?: string | null
        shipping_subdistrict_id?: string | null
        shipping_province_name?: string | null
        shipping_city_name?: string | null
        shipping_district_name?: string | null
        shipping_subdistrict_name?: string | null
        postal_code?: string | null
        currency?: string | null
      }, customerToken?: string) {
        return apiFetch(p('/ecommerce/orders'), "POST", body, undefined, { customerToken })
      },
      get(idOrNumber: string) {
        return apiFetch(`${p('/ecommerce/orders')}/${idOrNumber}`)
      },
    },
  },
}
