import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/Modal'
import { useToast } from '@/components/Toast'
import { ProductForm } from '@/features/products/components'
import { useProductStore } from '@/features/products/store'
import { ProductStatus } from '@/features/products/types'
import type { ProductFormData } from '@/features/products/types'
import styles from './Home.module.scss'

export function Home() {
  const products = useProductStore((s) => s.products)
  const isLoading = useProductStore((s) => s.isLoading)
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const addProduct = useProductStore((s) => s.addProduct)
  const { show } = useToast()

  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

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

  const total = products.length
  const active = products.filter((p) => p.status === ProductStatus.ACTIVE).length
  const inactive = products.filter((p) => p.status === ProductStatus.INACTIVE).length

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          E-Commerce Admin
        </span>
        <h1 className={styles.title}>Bem-vindo ao painel de gestão</h1>
        <p className={styles.subtitle}>
          Gerencie seu catálogo de produtos de forma simples, rápida e eficiente.
        </p>
        <div className={styles.actions}>
          <Link to="/products" className={styles.cta}>
            Ver Produtos
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total de produtos</span>
          <span className={styles.statValue}>
            {isLoading ? '—' : total}
          </span>
          <span className={styles.statDescription}>Produtos no catálogo</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Ativos</span>
          <span className={`${styles.statValue} ${styles.statValueActive}`}>
            {isLoading ? '—' : active}
          </span>
          <span className={styles.statDescription}>Disponíveis para venda</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Inativos</span>
          <span className={`${styles.statValue} ${styles.statValueInactive}`}>
            {isLoading ? '—' : inactive}
          </span>
          <span className={styles.statDescription}>Fora de catálogo</span>
        </div>
      </div>

      <div className={styles.quickSection}>
        <span className={styles.sectionTitle}>Acesso rápido</span>
        <div className={styles.quickLinks}>
          <Link to="/products" className={styles.quickLink}>
            Ver todos os produtos
          </Link>
          <button className={styles.quickLink} onClick={() => setIsNewProductOpen(true)}>
            + Adicionar produto
          </button>
        </div>
      </div>
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
    </div>
  )
}
