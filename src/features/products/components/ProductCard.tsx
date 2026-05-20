import { Button } from '@/components/Button'
import { ToggleSwitch } from '@/components/ToggleSwitch'
import { ProductStatus } from '../types'
import type { Product } from '../types'
import styles from './ProductCard.module.scss'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

export function ProductCard({ product, onEdit, onToggleStatus, onDelete }: ProductCardProps) {
  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const isActive = product.status === ProductStatus.ACTIVE

  return (
    <article className={`${styles.card} ${!isActive ? styles.inactive : ''}`}>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className={styles.image} />
      )}

      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.category}>{product.category}</span>
          <ToggleSwitch
            checked={isActive}
            label={isActive ? 'Ativo' : 'Inativo'}
            onChange={() => onToggleStatus(String(product.id))}
          />
        </div>

        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{formattedPrice}</span>
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(String(product.id))}>
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
