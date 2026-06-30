const BASE_API_URL = "https://templatium-cms.secure-staging.com/api"
const PRODUCTS_URL = `${BASE_API_URL}/ecommerce/products`
const PRODUCT_CATEGORIES_URL = `${BASE_API_URL}/ecommerce/categories`
const CLIENT_URL = `${BASE_API_URL}/client`

let apiKey: string | null = null

async function apiGet(url: string) {
  if (!apiKey) throw new Error('SDK not initialized. Call templatiumSdk.init(key) first.')

  const res = await fetch(url, {
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
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
        return apiGet(CLIENT_URL)
      },
    },
    product: {
      get() {
        console.log({PRODUCTS_URL})
        return apiGet(PRODUCTS_URL)
      },
    },
    productCategory: {
      get() {
        return apiGet(PRODUCT_CATEGORIES_URL)
      },
    },
  },
}
