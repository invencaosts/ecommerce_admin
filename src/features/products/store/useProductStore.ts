import { create } from 'zustand'
import { productService } from '../services'
import { ProductStatus } from '../types'
import type { Product, ProductFilter, ProductFormData } from '../types'

interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  filters: ProductFilter
}

interface ProductActions {
  fetchProducts: () => Promise<void>
  addProduct: (data: ProductFormData) => Promise<void>
  editProduct: (id: string, data: ProductFormData) => Promise<void>
  toggleStatus: (id: string) => Promise<void>
  removeProduct: (id: string) => Promise<void>
  setFilters: (filters: Partial<ProductFilter>) => void
  clearFilters: () => void
}

type ProductStore = ProductState & ProductActions

const INITIAL_STATE: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  filters: {},
}

export const useProductStore = create<ProductStore>((set, get) => ({
  ...INITIAL_STATE,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const products = await productService.getProducts()
      set({ products })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao buscar produtos' })
    } finally {
      set({ isLoading: false })
    }
  },

  addProduct: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const created = await productService.createProduct(data)
      set((state) => ({ products: [created, ...state.products] }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao criar produto' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  editProduct: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await productService.updateProduct(id, data)
      set((state) => ({
        products: state.products.map((p) => (p.id === updated.id ? updated : p)),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao atualizar produto' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  toggleStatus: async (id) => {
    const previous = get().products
    const target = previous.find((p) => String(p.id) === id)
    if (!target) return
    const nextStatus = target.status === ProductStatus.ACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE
    set((state) => ({
      products: state.products.map((p) => String(p.id) === id ? { ...p, status: nextStatus } : p),
    }))
    try {
      await productService.patchStatus(id, nextStatus)
    } catch (err) {
      set({ products: previous, error: err instanceof Error ? err.message : 'Erro ao atualizar status' })
      throw err
    }
  },

  removeProduct: async (id) => {
    const previous = get().products
    set((state) => ({ products: state.products.filter((p) => String(p.id) !== id) }))
    try {
      await productService.deleteProduct(id)
    } catch (err) {
      set({ products: previous, error: err instanceof Error ? err.message : 'Erro ao remover produto' })
      throw err
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
  },

  clearFilters: () => {
    set({ filters: {} })
  },
}))
