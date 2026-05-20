import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { ProductCategory, ProductStatus } from '../types'
import type { Product, ProductFormData } from '../types'
import styles from './ProductForm.module.scss'

export const productFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),

  description: z
    .string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres'),

  price: z
    .number({ error: 'Informe um preço válido' })
    .positive('Preço deve ser maior que zero'),

  category: z.nativeEnum(ProductCategory, { error: 'Selecione uma categoria' }),

  status: z.nativeEnum(ProductStatus, { error: 'Selecione um status' }),

  imageUrl: z
    .string()
    .url('Informe uma URL válida')
    .or(z.literal(''))
    .optional(),
})

type FormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.ELECTRONICS]: 'Eletrônicos',
  [ProductCategory.CLOTHING]: 'Vestuário',
  [ProductCategory.FOOD]: 'Alimentos',
  [ProductCategory.HOME]: 'Casa',
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className={styles.error} role="alert">
      {message}
    </p>
  )
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const isEditing = product !== undefined

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        status: product.status,
        imageUrl: product.imageUrl,
      }
      : {
        name: '',
        description: '',
        category: ProductCategory.ELECTRONICS,
        status: ProductStatus.ACTIVE,
        imageUrl: '',
      },
  })

  function onValid(values: FormValues) {
    onSubmit({
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category,
      status: values.status,
      imageUrl: values.imageUrl ?? '',
    })
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onValid)}
      noValidate
      aria-label={isEditing ? 'Editar produto' : 'Novo produto'}
    >
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Nome <span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder="Ex: Smartphone Galaxy X12"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Descrição <span className={styles.required}>*</span>
        </label>
        <textarea
          id="description"
          rows={3}
          className={`${styles.input} ${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          placeholder="Descreva o produto com pelo menos 10 caracteres"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="price" className={styles.label}>
            Preço (R$) <span className={styles.required}>*</span>
          </label>
          <input
            id="price"
            type="number"
            min={0.01}
            step={0.01}
            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
            placeholder="0,00"
            aria-invalid={!!errors.price}
            {...register('price', { valueAsNumber: true })}
          />
          <FieldError message={errors.price?.message} />
        </div>

        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            Categoria <span className={styles.required}>*</span>
          </label>
          <select
            id="category"
            className={`${styles.input} ${styles.select} ${errors.category ? styles.inputError : ''}`}
            aria-invalid={!!errors.category}
            {...register('category')}
          >
            {Object.values(ProductCategory).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <FieldError message={errors.category?.message} />
        </div>

        <div className={styles.field}>
          <label htmlFor="status" className={styles.label}>
            Status <span className={styles.required}>*</span>
          </label>
          <select
            id="status"
            className={`${styles.input} ${styles.select} ${errors.status ? styles.inputError : ''}`}
            aria-invalid={!!errors.status}
            {...register('status')}
          >
            <option value={ProductStatus.ACTIVE}>Ativo</option>
            <option value={ProductStatus.INACTIVE}>Inativo</option>
          </select>
          <FieldError message={errors.status?.message} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="imageUrl" className={styles.label}>
          URL da Imagem
          <span className={styles.optional}> (opcional)</span>
        </label>
        <input
          id="imageUrl"
          type="url"
          className={`${styles.input} ${errors.imageUrl ? styles.inputError : ''}`}
          placeholder="https://exemplo.com/imagem.jpg"
          aria-invalid={!!errors.imageUrl}
          {...register('imageUrl')}
        />
        <FieldError message={errors.imageUrl?.message} />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {isEditing ? 'Salvar alterações' : 'Criar produto'}
        </Button>
      </div>
    </form>
  )
}
