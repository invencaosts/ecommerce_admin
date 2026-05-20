import { productFormSchema } from './ProductForm'
import { ProductCategory, ProductStatus } from '../types'

const valid = {
  name: 'Smartphone Galaxy X12',
  description: 'Descrição com pelo menos 10 caracteres.',
  price: 2799.9,
  category: ProductCategory.ELECTRONICS,
  status: ProductStatus.ACTIVE,
  imageUrl: 'https://exemplo.com/imagem.jpg',
}

describe('productFormSchema — validações de negócio', () => {
  it('aceita dados válidos completos', () => {
    expect(productFormSchema.safeParse(valid).success).toBe(true)
  })

  it('aceita sem imageUrl (campo opcional)', () => {
    const { imageUrl: _, ...sem } = valid
    expect(productFormSchema.safeParse(sem).success).toBe(true)
  })

  it('aceita imageUrl como string vazia', () => {
    expect(productFormSchema.safeParse({ ...valid, imageUrl: '' }).success).toBe(true)
  })

  it('rejeita nome vazio', () => {
    const r = productFormSchema.safeParse({ ...valid, name: '' })
    expect(r.success).toBe(false)
  })

  it('rejeita nome com menos de 3 caracteres', () => {
    const r = productFormSchema.safeParse({ ...valid, name: 'AB' })
    expect(r.success).toBe(false)
  })

  it('rejeita descrição vazia', () => {
    const r = productFormSchema.safeParse({ ...valid, description: '' })
    expect(r.success).toBe(false)
  })

  it('rejeita descrição com menos de 10 caracteres', () => {
    const r = productFormSchema.safeParse({ ...valid, description: 'Curta' })
    expect(r.success).toBe(false)
  })

  it('rejeita preço zero', () => {
    const r = productFormSchema.safeParse({ ...valid, price: 0 })
    expect(r.success).toBe(false)
  })

  it('rejeita preço negativo', () => {
    const r = productFormSchema.safeParse({ ...valid, price: -1 })
    expect(r.success).toBe(false)
  })

  it('rejeita categoria inválida', () => {
    const r = productFormSchema.safeParse({ ...valid, category: 'Inexistente' })
    expect(r.success).toBe(false)
  })

  it('aceita todas as categorias válidas do enum', () => {
    for (const cat of Object.values(ProductCategory)) {
      const r = productFormSchema.safeParse({ ...valid, category: cat })
      expect(r.success).toBe(true)
    }
  })

  it('rejeita status inválido', () => {
    const r = productFormSchema.safeParse({ ...valid, status: 'pendente' })
    expect(r.success).toBe(false)
  })

  it('aceita status ativo e inativo', () => {
    expect(productFormSchema.safeParse({ ...valid, status: ProductStatus.ACTIVE }).success).toBe(true)
    expect(productFormSchema.safeParse({ ...valid, status: ProductStatus.INACTIVE }).success).toBe(true)
  })

  it('rejeita imageUrl que não é uma URL válida', () => {
    const r = productFormSchema.safeParse({ ...valid, imageUrl: 'nao-e-uma-url' })
    expect(r.success).toBe(false)
  })
})
