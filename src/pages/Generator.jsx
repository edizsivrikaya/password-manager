import { useState } from 'react'
import { Link } from 'react-router'
import { generatePassword } from '../lib/generator'
import { useToastStore } from '../store/toastStore'
import Button from '../components/Button'
import ThemeToggle from '../components/ThemeToggle'
import { LockIcon, CopyIcon } from '../components/Icon'

const DEFAULTS = {
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
}

const OPTIONS = [
  { name: 'uppercase', label: 'Büyük Harfler (A-Z)' },
  { name: 'lowercase', label: 'Küçük Harfler (a-z)' },
  { name: 'numbers', label: 'Rakamlar (0-9)' },
  { name: 'symbols', label: 'Özel Semboller (!@#$)' },
]

function Generator() {
  const showToast = useToastStore((state) => state.showToast)

  const [options, setOptions] = useState(DEFAULTS)
  const [password, setPassword] = useState('')

  function handleChange(event) {
    const { name, type, checked, value } = event.target

    setOptions({
      ...options,
      [name]: type === 'checkbox' ? checked : Number(value),
    })
  }

  function handleGenerate() {
    setPassword(generatePassword(options))
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(password)
      showToast('Parola kopyalandı')
    } catch {
      showToast('Kopyalanamadı', 'error')
    }
  }

  const noneSelected = OPTIONS.every((option) => !options[option.name])

  return (
    <div>
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <LockIcon className="size-5" />
            </div>
            <h1 className="text-xl font-bold">Şifre Üretici</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/dashboard">
              <Button variant="secondary">Kasama dön</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {password && (
            <div className="mb-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-center font-mono text-lg break-all text-emerald-600 dark:text-emerald-400">
                {password}
              </p>
              <Button
                variant="secondary"
                onClick={handleCopy}
                className="mt-3 w-full"
              >
                <CopyIcon />
                Şifreyi Kopyala
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Uzunluk:
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {options.length} Karakter
            </span>
          </div>
          <input
            name="length"
            type="range"
            min="8"
            max="64"
            value={options.length}
            onChange={handleChange}
            className="mt-2 w-full accent-indigo-600"
          />

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            {OPTIONS.map((option) => (
              <label
                key={option.name}
                className="flex cursor-pointer items-center justify-between text-sm"
              >
                {option.label}
                <input
                  name={option.name}
                  type="checkbox"
                  checked={options[option.name]}
                  onChange={handleChange}
                  className="size-4 accent-indigo-600"
                />
              </label>
            ))}
          </div>

          {noneSelected && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">
              En az bir karakter tipi seçmelisin.
            </p>
          )}

          <Button
            onClick={handleGenerate}
            disabled={noneSelected}
            variant="secondary"
            className="mt-5 w-full py-2.5 text-indigo-600 dark:text-indigo-400"
          >
            {password ? 'Yeni Şifre Üret' : 'Üret'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Generator
