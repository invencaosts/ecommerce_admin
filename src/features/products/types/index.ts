export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ProductCategory {
  ELECTRONICS = 'Eletrônicos',
  CLOTHING = 'Vestuário',
  FOOD = 'Alimentos',
  HOME = 'Casa',
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: ProductCategory
  status: ProductStatus
  imageUrl: string
  createdAt: string
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  category: ProductCategory
  status: ProductStatus
  imageUrl: string
}

export interface ProductFilter {
  category?: ProductCategory
  status?: ProductStatus
  minPrice?: number
  maxPrice?: number
}
