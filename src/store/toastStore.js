import { create } from 'zustand'

export const useToastStore = create((set, get) => ({
  toasts: [],

  showToast: (message, type = 'success') => {
    const id = crypto.randomUUID()

    set({ toasts: [...get().toasts, { id, message, type }] })

    setTimeout(() => {
      set({ toasts: get().toasts.filter((toast) => toast.id !== id) })
    }, 2500)
  },
}))
