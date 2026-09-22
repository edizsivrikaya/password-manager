import { useState } from 'react'
import { useVaultStore } from '../store/vaultStore'
import { useToastStore } from '../store/toastStore'
import { colorFor } from '../lib/display'
import { EyeIcon, EyeOffIcon, CopyIcon } from './Icon'
import Button from './Button'

function EntryCard({ entry, onEdit }) {
  const getEntryPassword = useVaultStore((state) => state.getEntryPassword)
  const deleteEntry = useVaultStore((state) => state.deleteEntry)
  const showToast = useToastStore((state) => state.showToast)

  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const color = colorFor(entry.category || entry.title)

  async function handleReveal() {
    const decrypted = await getEntryPassword(entry.id)
    setPassword(decrypted)
    setVisible(true)
  }

  function handleHide() {
    setVisible(false)
    setPassword('')
  }

  async function handleCopy() {
    try {
      const decrypted = await getEntryPassword(entry.id)
      await navigator.clipboard.writeText(decrypted)
      showToast('Parola kopyalandı')
    } catch {
      showToast('Kopyalanamadı', 'error')
    }
  }

  async function handleEdit() {
    const decrypted = await getEntryPassword(entry.id)
    onEdit({ ...entry, password: decrypted })
  }

  function handleDelete() {
    deleteEntry(entry.id)
    showToast('Kayıt silindi')
  }

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${color}`}
          >
            {entry.title.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold">{entry.title}</h3>
            {entry.username && (
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {entry.username}
              </p>
            )}
          </div>
        </div>

        {entry.category && (
          <span
            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium ${color}`}
          >
            {entry.category}
          </span>
        )}
      </div>

      <button
        type="button"
        onMouseEnter={handleReveal}
        onMouseLeave={handleHide}
        onFocus={handleReveal}
        onBlur={handleHide}
        onClick={handleCopy}
        title="Görmek için üzerine gel, kopyalamak için tıkla"
        className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800"
      >
        <span className="shrink-0 text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500">
          ŞİFRE
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-sm">
          {visible ? password : '••••••••••••'}
        </span>
        <span className="flex shrink-0 gap-2.5 text-slate-400 dark:text-slate-500">
          {visible ? <EyeOffIcon /> : <EyeIcon />}
          <CopyIcon />
        </span>
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
        <Button variant="ghost" onClick={handleEdit}>
          Düzenle
        </Button>

        {confirming ? (
          <>
            <Button variant="dangerSoft" onClick={handleDelete}>
              Onayla
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Vazgeç
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setConfirming(true)}
            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Sil
          </Button>
        )}
      </div>
    </li>
  )
}

export default EntryCard
