import { useProductStore } from '../store'
import { ProductCategory, ProductStatus } from '../types'
import styles from './ProductFilter.module.scss'

export function ProductFilter() {
  const filters = useProductStore((s) => s.filters)
  const setFilters = useProductStore((s) => s.setFilters)
  const clearFilters = useProductStore((s) => s.clearFilters)

  const hasActiveFilters =
    filters.category !== undefined ||
    filters.status !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined

  return (
    <div className={styles.container}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>Categoria</span>
          <select
            value={filters.category ?? ''}
            onChange={(e) =>
              setFilters({ category: (e.target.value as ProductCategory) || undefined })
            }
          >
            <option value="">Todas</option>
            {Object.values(ProductCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Status</span>
          <select
            value={filters.status ?? ''}
            onChange={(e) =>
              setFilters({ status: (e.target.value as ProductStatus) || undefined })
            }
          >
            <option value="">Todos</option>
            <option value={ProductStatus.ACTIVE}>Ativo</option>
            <option value={ProductStatus.INACTIVE}>Inativo</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Preço mín.</span>
          <input
            type="number"
            min={0}
            placeholder="R$ 0"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              setFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </label>

        <label className={styles.field}>
          <span>Preço máx.</span>
          <input
            type="number"
            min={0}
            placeholder="R$ ∞"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              setFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </label>
      </div>

      {hasActiveFilters && (
        <button className={styles.clear} onClick={clearFilters}>
          Limpar filtros
        </button>
      )}
    </div>
  )
}
