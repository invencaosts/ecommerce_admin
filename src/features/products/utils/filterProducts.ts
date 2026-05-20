import type { Product, ProductFilter } from '../types'

export function filterProducts(products: Product[], filters: ProductFilter): Product[] {
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.status && p.status !== filters.status) return false
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false
    return true
  })
}
