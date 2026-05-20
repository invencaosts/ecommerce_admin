import { api } from '@/api/axios'
import type { Product, ProductFormData, ProductStatus } from '../types'

const BASE = '/products'

export const productService = {
  getProducts(): Promise<Product[]> {
    return api.get<Product[]>(BASE).then((r) => r.data)
  },

  getProductById(id: string): Promise<Product> {
    return api.get<Product>(`${BASE}/${id}`).then((r) => r.data)
  },

  createProduct(data: ProductFormData): Promise<Product> {
    return api.post<Product>(BASE, data).then((r) => r.data)
  },

  updateProduct(id: string, data: ProductFormData): Promise<Product> {
    return api.put<Product>(`${BASE}/${id}`, data).then((r) => r.data)
  },

  patchStatus(id: string, status: ProductStatus): Promise<Product> {
    return api.patch<Product>(`${BASE}/${id}`, { status }).then((r) => r.data)
  },

  deleteProduct(id: string): Promise<void> {
    return api.delete(`${BASE}/${id}`).then(() => undefined)
  },
}
