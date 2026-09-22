import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useVaultStore } from '../store/vaultStore'
import Button from '../components/Button'
import Input from '../components/Input'
import { LockIcon } from '../components/Icon'

function Unlock() {
  const navigate = useNavigate()
  const salt = useVaultStore((state) => state.salt)
  const setup = useVaultStore((state) => state.setup)
  const unlock = useVaultStore((state) => state.unlock)
  const isUnlocked = useVaultStore((state) => state.isUnlocked)

  const isFirstTime = salt === null

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isUnlocked) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (isFirstTime) {
      if (password === '') {
        setError('Ana parola boş olamaz.')
        return
      }
      if (password !== confirm) {
        setError('Parolalar eşleşmiyor.')
        return
      }
    }

    setBusy(true)

    if (isFirstTime) {
      await setup(password)
    } else {
      const success = await unlock(password)
      if (!success) {
        setError('Ana parola hatalı.')
        setBusy(false)
        return
      }
    }

    navigate('/dashboard')
  }

  const buttonLabel = isFirstTime ? 'Kasayı Oluştur' : 'Aç'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <LockIcon className="size-7" />
          </div>
          <h1 className="text-xl font-bold">
            {isFirstTime ? 'Ana Parola Belirle' : 'Kasayı Aç'}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isFirstTime
              ? 'Bu parola hiçbir yere kaydedilmez. Unutursan kayıtlarına bir daha erişemezsin.'
              : 'Devam etmek için ana parolanı gir.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ana parola"
            autoFocus
          />

          {isFirstTime && (
            <Input
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Parolayı tekrar gir"
            />
          )}

          <Button type="submit" disabled={busy} className="mt-1 w-full py-2.5">
            {busy ? 'Lütfen bekle...' : buttonLabel}
          </Button>
        </form>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default Unlock
