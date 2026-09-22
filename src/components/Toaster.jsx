import { useToastStore } from '../store/toastStore'

const COLORS = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
}

function Toaster() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg ${COLORS[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default Toaster
