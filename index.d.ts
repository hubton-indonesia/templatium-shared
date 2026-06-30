export interface ProductData {
  id: number;
  title: string;
  price: string;
  rawPrice: number;
  originalPrice: string | null;
  isSale: boolean;
  thumbnail: string;
  category: string;
  colors?: string[];
}
