import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { ConfirmModal, Modal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { ProductFilter, ProductForm, ProductList } from '@/features/products/components'
import { useProductStore } from '@/features/products/store'
import type { Product, ProductFormData } from '@/features/products/types'
import { filterProducts } from '@/features/products/utils'
import styles from './ProductListPage.module.scss'

export function ProductListPage() {
  const navigate = useNavigate()
  const { show } = useToast()

  const products = useProductStore((s) => s.products)
  const isLoading = useProductStore((s) => s.isLoading)
  const error = useProductStore((s) => s.error)
  const filters = useProductStore((s) => s.filters)
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const addProduct = useProductStore((s) => s.addProduct)
  const toggleStatus = useProductStore((s) => s.toggleStatus)
  const removeProduct = useProductStore((s) => s.removeProduct)

  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const hasActiveFilters =
    filters.category !== undefined ||
    filters.status !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters])

  async function handleCreate(data: ProductFormData) {
    setIsCreating(true)
    try {
      await addProduct(data)
      show('Produto criado com sucesso!')
      setIsNewProductOpen(false)
    } catch {
      show('Erro ao criar produto.', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  function handleEdit(product: Product) {
    navigate(`/products/${product.id}/edit`)
  }

  async function handleToggleStatus(id: string) {
    try {
      await toggleStatus(id)
    } catch {
      show('Não foi possível alterar o status do produto.', 'error')
    }
  }

  function handleDeleteRequest(id: string) {
    setDeleteTarget(id)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await removeProduct(deleteTarget)
      show('Produto excluído com sucesso!')
    } catch {
      show('Não foi possível excluir o produto.', 'error')
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Produtos</h1>
          {!isLoading && (
            <span className={styles.count}>
              {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}
            </span>
          )}
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.filterBtn} ${isFilterOpen ? styles.filterBtnActive : ''} ${hasActiveFilters ? styles.filterBtnDot : ''}`}
            onClick={() => setIsFilterOpen((v) => !v)}
            aria-expanded={isFilterOpen}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1.586a1 1 0 01-.293.707l-4.414 4.414A1 1 0 0012 11v4.382a1 1 0 01-.553.894l-2 1A1 1 0 018 16.382V11a1 1 0 00-.293-.707L3.293 5.879A1 1 0 013 5.172V4z" clipRule="evenodd" />
            </svg>
            Filtros
            {hasActiveFilters && <span className={styles.filterDot} />}
          </button>
          <Button onClick={() => setIsNewProductOpen(true)}>+ Novo Produto</Button>
        </div>
      </div>

      {isFilterOpen && <ProductFilter />}

      {error && !isLoading && (
        <div className={styles.errorBanner} role="alert">
          <span>{error}</span>
          <button className={styles.retryBtn} onClick={() => fetchProducts()}>
            Tentar novamente
          </button>
        </div>
      )}

      <ProductList
        products={filtered}
        isLoading={isLoading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteRequest}
      />

      <Modal
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
        title="Novo Produto"
        size="md"
      >
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setIsNewProductOpen(false)}
          isLoading={isCreating}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Excluir produto"
        message="Esta ação não pode ser desfeita. Deseja realmente excluir este produto?"
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
