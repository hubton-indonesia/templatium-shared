export { formatIDR, formatUSD } from "./format-currency.js"

const BASE_API_URL = "https://templatium-cms.secure-staging.com/api"
const PRODUCTS_URL = `${BASE_API_URL}/ecommerce/products`
const PRODUCT_CATEGORIES_URL = `${BASE_API_URL}/ecommerce/categories`
const CLIENT_URL = `${BASE_API_URL}/ecommerce/client`
const CART_URL = `${BASE_API_URL}/ecommerce/cart`

let apiKey: string | null = null

async function apiFetch(url: string, method: string = "GET", body?: unknown) {
  if (!apiKey) throw new Error('SDK not initialized. Call templatiumSdk.init(key) first.')

  const res = await fetch(url, {
    method,
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const templatiumSdk = {
  init(key: string) {
    apiKey = key
  },
  ecommerce: {
    client: {
      get() {
        return apiFetch(CLIENT_URL)
      },
    },
    product: {
      get(id?: string) {
        console.log(id ? `${PRODUCTS_URL}/${id}` : PRODUCTS_URL)
        return apiFetch(id ? `${PRODUCTS_URL}/${id}` : PRODUCTS_URL)
      },
    },
    productCategory: {
      get() {
        return apiFetch(PRODUCT_CATEGORIES_URL)
      },
    },
    cart: {
      createOrRetrieve(body: { session_id?: string | null; user_id?: string | null }) {
        return apiFetch(CART_URL, "POST", body)
      },
      get(cartId: string) {
        return apiFetch(`${CART_URL}/${cartId}`)
      },
      addItem(cartId: string, body: { product_variant_id: string; quantity?: number | null }) {
        return apiFetch(`${CART_URL}/${cartId}/items`, "POST", body)
      },
      updateItem(cartId: string, itemId: string, body: { quantity: number }) {
        return apiFetch(`${CART_URL}/${cartId}/items/${itemId}`, "PATCH", body)
      },
      removeItem(cartId: string, itemId: string) {
        return apiFetch(`${CART_URL}/${cartId}/items/${itemId}`, "DELETE")
      },
    },
  },
}
