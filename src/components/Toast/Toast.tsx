import { createPortal } from 'react-dom'
import { useToast, type Toast as ToastItem } from './useToast'
import styles from './Toast.module.scss'

const ICONS: Record<ToastItem['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'i',
}

function ToastMessage({ toast }: { toast: ToastItem }) {
  const { dismiss } = useToast()

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="alert" aria-live="polite">
      <span className={styles.icon} aria-hidden>{ICONS[toast.type]}</span>
      <span className={styles.message}>{toast.message}</span>
      <button
        className={styles.close}
        onClick={() => dismiss(toast.id)}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()

  return createPortal(
    <div className={styles.container} aria-label="Notificações">
      {toasts.map((t) => (
        <ToastMessage key={t.id} toast={t} />
      ))}
    </div>,
    document.body,
  )
}
