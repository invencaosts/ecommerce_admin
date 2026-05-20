import { vi, beforeEach, describe, it, expect } from 'vitest'
import { useProductStore } from './useProductStore'
import { ProductCategory, ProductStatus } from '../types'
import type { Product } from '../types'

vi.mock('@/features/products/services', () => ({
  productService: {
    getProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    getProductById: vi.fn(),
  },
}))

import { productService } from '@/features/products/services'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Produto Teste',
    description: 'Descrição teste',
    price: 100,
    category: ProductCategory.ELECTRONICS,
    status: ProductStatus.ACTIVE,
    imageUrl: '',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const INITIAL = { products: [], isLoading: false, error: null, filters: {} }

beforeEach(() => {
  useProductStore.setState(INITIAL)
  vi.clearAllMocks()
})

describe('useProductStore — fetchProducts', () => {
  it('popula products no sucesso', async () => {
    const list = [makeProduct({ id: 1 }), makeProduct({ id: 2 })]
    vi.mocked(productService.getProducts).mockResolvedValue(list)

    await useProductStore.getState().fetchProducts()

    expect(useProductStore.getState().products).toEqual(list)
    expect(useProductStore.getState().isLoading).toBe(false)
    expect(useProductStore.getState().error).toBeNull()
  })

  it('define error quando a API falha', async () => {
    vi.mocked(productService.getProducts).mockRejectedValue(new Error('Servidor indisponível'))

    await useProductStore.getState().fetchProducts()

    expect(useProductStore.getState().error).toBe('Servidor indisponível')
    expect(useProductStore.getState().products).toHaveLength(0)
    expect(useProductStore.getState().isLoading).toBe(false)
  })
})

describe('useProductStore — addProduct', () => {
  it('insere o novo produto no início da lista', async () => {
    const existing = makeProduct({ id: 1, name: 'Existente' })
    useProductStore.setState({ products: [existing] })

    const created = makeProduct({ id: 2, name: 'Novo' })
    vi.mocked(productService.createProduct).mockResolvedValue(created)

    await useProductStore.getState().addProduct({
      name: 'Novo',
      description: 'Descrição longa o suficiente',
      price: 99,
      category: ProductCategory.ELECTRONICS,
      status: ProductStatus.ACTIVE,
      imageUrl: '',
    })

    const { products } = useProductStore.getState()
    expect(products[0]).toEqual(created)
    expect(products).toHaveLength(2)
  })
})

describe('useProductStore — removeProduct', () => {
  it('remove o produto da lista (optimistic)', async () => {
    const p1 = makeProduct({ id: 1 })
    const p2 = makeProduct({ id: 2 })
    useProductStore.setState({ products: [p1, p2] })
    vi.mocked(productService.deleteProduct).mockResolvedValue(undefined)

    await useProductStore.getState().removeProduct('1')

    const { products } = useProductStore.getState()
    expect(products).toHaveLength(1)
    expect(products[0].id).toBe(2)
  })

  it('restaura a lista se a API falhar (rollback)', async () => {
    const p1 = makeProduct({ id: 1 })
    const p2 = makeProduct({ id: 2 })
    useProductStore.setState({ products: [p1, p2] })
    vi.mocked(productService.deleteProduct).mockRejectedValue(new Error('Erro'))

    await expect(useProductStore.getState().removeProduct('1')).rejects.toThrow()

    expect(useProductStore.getState().products).toHaveLength(2)
  })
})

describe('useProductStore — setFilters / clearFilters', () => {
  it('mescla filtros parciais sem sobrescrever outros', () => {
    useProductStore.getState().setFilters({ category: ProductCategory.FOOD })
    useProductStore.getState().setFilters({ status: ProductStatus.ACTIVE })

    const { filters } = useProductStore.getState()
    expect(filters.category).toBe(ProductCategory.FOOD)
    expect(filters.status).toBe(ProductStatus.ACTIVE)
  })

  it('clearFilters remove todos os filtros', () => {
    useProductStore.setState({ filters: { category: ProductCategory.FOOD, minPrice: 10 } })
    useProductStore.getState().clearFilters()

    expect(useProductStore.getState().filters).toEqual({})
  })
})
