import { filterProducts } from './filterProducts'
import { ProductCategory, ProductStatus } from '../types'
import type { Product } from '../types'

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

const products: Product[] = [
  makeProduct({ id: 1, category: ProductCategory.ELECTRONICS, status: ProductStatus.ACTIVE, price: 100 }),
  makeProduct({ id: 2, category: ProductCategory.CLOTHING, status: ProductStatus.ACTIVE, price: 200 }),
  makeProduct({ id: 3, category: ProductCategory.FOOD, status: ProductStatus.INACTIVE, price: 50 }),
  makeProduct({ id: 4, category: ProductCategory.ELECTRONICS, status: ProductStatus.INACTIVE, price: 300 }),
]

describe('filterProducts', () => {
  it('retorna todos os produtos quando não há filtros', () => {
    expect(filterProducts(products, {})).toHaveLength(4)
  })

  it('filtra por categoria', () => {
    const result = filterProducts(products, { category: ProductCategory.ELECTRONICS })
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.category === ProductCategory.ELECTRONICS)).toBe(true)
  })

  it('filtra por status ativo', () => {
    const result = filterProducts(products, { status: ProductStatus.ACTIVE })
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.status === ProductStatus.ACTIVE)).toBe(true)
  })

  it('filtra por status inativo', () => {
    const result = filterProducts(products, { status: ProductStatus.INACTIVE })
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.status === ProductStatus.INACTIVE)).toBe(true)
  })

  it('filtra por preço mínimo', () => {
    const result = filterProducts(products, { minPrice: 150 })
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.price >= 150)).toBe(true)
  })

  it('filtra por preço máximo', () => {
    const result = filterProducts(products, { maxPrice: 150 })
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.price <= 150)).toBe(true)
  })

  it('filtra por faixa de preço (mín + máx)', () => {
    const result = filterProducts(products, { minPrice: 80, maxPrice: 250 })
    expect(result).toHaveLength(2)
    expect(result.map((p) => p.id)).toEqual(expect.arrayContaining([1, 2]))
  })

  it('combina categoria e status', () => {
    const result = filterProducts(products, {
      category: ProductCategory.ELECTRONICS,
      status: ProductStatus.ACTIVE,
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('retorna lista vazia quando nenhum produto bate os filtros', () => {
    const result = filterProducts(products, { minPrice: 9999 })
    expect(result).toHaveLength(0)
  })

  it('não exclui produto cujo preço é exatamente igual ao mínimo', () => {
    const result = filterProducts(products, { minPrice: 100 })
    const ids = result.map((p) => p.id)
    expect(ids).toContain(1)
  })

  it('não exclui produto cujo preço é exatamente igual ao máximo', () => {
    const result = filterProducts(products, { maxPrice: 100 })
    const ids = result.map((p) => p.id)
    expect(ids).toContain(1)
  })
})
