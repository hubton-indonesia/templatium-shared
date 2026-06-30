import { templatiumSdk } from "./index.js";

const key = process.env.TEMPLATIUM_CMS_API_KEY;
if (!key) throw new Error("TEMPLATIUM_CMS_API_KEY not set in environment");

templatiumSdk.init(key);

const products = await templatiumSdk.ecommerce.product.get();
console.log(products);

const client = await templatiumSdk.ecommerce.client.get();
console.log(client);
