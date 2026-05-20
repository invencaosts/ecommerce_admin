import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { useToast } from '@/components/Toast'
import { ProductForm } from '@/features/products/components'
import { productService } from '@/features/products/services'
import { useProductStore } from '@/features/products/store'
import type { Product, ProductFormData } from '@/features/products/types'
import styles from './ProductFormPage.module.scss'

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { show } = useToast()
  const isEditing = !!id

  const addProduct = useProductStore((s) => s.addProduct)
  const editProduct = useProductStore((s) => s.editProduct)

  const [product, setProduct] = useState<Product | undefined>()
  const [isFetching, setIsFetching] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setIsFetching(true)
    productService
      .getProductById(id)
      .then(setProduct)
      .catch(() => setFetchError('Produto não encontrado.'))
      .finally(() => setIsFetching(false))
  }, [id])

  async function handleSubmit(data: ProductFormData) {
    setIsSubmitting(true)
    try {
      if (isEditing && id) {
        await editProduct(id, data)
        show('Produto atualizado com sucesso!')
      } else {
        await addProduct(data)
        show('Produto criado com sucesso!')
      }
      navigate('/products')
    } catch {
      show(
        isEditing ? 'Erro ao atualizar produto.' : 'Erro ao criar produto.',
        'error',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← Voltar
        </Button>
        <h1 className={styles.title}>
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h1>
      </div>

      {isFetching && <p className={styles.feedback}>Carregando produto...</p>}

      {fetchError && (
        <p className={styles.error} role="alert">
          {fetchError}
        </p>
      )}

      {!isFetching && !fetchError && (
        <div className={styles.card}>
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      )}
    </div>
  )
}
