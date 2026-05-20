import type { Product } from '../types'
import { ProductCard } from './ProductCard'
import styles from './ProductList.module.scss'

interface ProductListProps {
  products: Product[]
  isLoading: boolean
  onEdit: (product: Product) => void
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

function ProductCardSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden>
      <div className={`${styles.skeletonBlock} ${styles.skeletonImage}`} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonBlock} ${styles.skeletonLine} ${styles.short}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonLine}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonLine} ${styles.medium}`} />
      </div>
    </div>
  )
}

export function ProductList({ products, isLoading, onEdit, onToggleStatus, onDelete }: ProductListProps) {
  if (isLoading) {
    return (
      <div className={styles.grid} aria-label="Carregando produtos">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <span className={styles.emptyIcon}>📦</span>
        <p>Nenhum produto encontrado.</p>
        <small>Tente ajustar os filtros ou adicione um novo produto.</small>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
