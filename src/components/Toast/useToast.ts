import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastStore {
  toasts: Toast[]
  _add: (toast: Toast) => void
  dismiss: (id: number) => void
}

let _id = 0

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  _add: (toast) => set((s) => ({ toasts: [...s.toasts, toast] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export function useToast() {
  const { toasts, dismiss, _add } = useToastStore()

  function show(message: string, type: ToastType = 'success', duration = 4000) {
    const id = ++_id
    _add({ id, message, type })
    setTimeout(() => dismiss(id), duration)
  }

  return { toasts, show, dismiss }
}
