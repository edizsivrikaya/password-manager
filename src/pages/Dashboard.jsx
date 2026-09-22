import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useVaultStore } from '../store/vaultStore'
import EntryForm from '../components/EntryForm'
import EntryCard from '../components/EntryCard'
import Button from '../components/Button'
import Input from '../components/Input'
import ThemeToggle from '../components/ThemeToggle'
import { LockIcon, SearchIcon, PlusIcon } from '../components/Icon'

const ALL = 'Tümü'

function normalize(text) {
  return text
    .replaceAll('İ', 'i')
    .replaceAll('I', 'i')
    .replaceAll('ı', 'i')
    .toLowerCase()
}

function Dashboard() {
  const navigate = useNavigate()
  const lock = useVaultStore((state) => state.lock)
  const entries = useVaultStore((state) => state.entries)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL)

  const categories = [
    ...new Set(entries.map((entry) => entry.category)),
  ].filter((name) => name !== '')

  const query = normalize(search.trim())

  const visibleEntries = entries.filter((entry) => {
    if (category !== ALL && entry.category !== category) {
      return false
    }

    if (query === '') {
      return true
    }

    return (
      normalize(entry.title).includes(query) ||
      normalize(entry.username).includes(query) ||
      normalize(entry.category).includes(query)
    )
  })

  function handleLock() {
    lock()
    navigate('/unlock')
  }

  function handleEdit(entryWithPassword) {
    setEditing(entryWithPassword)
    setShowForm(true)
  }

  function handleClose() {
    setShowForm(false)
    setEditing(null)
    setSearch('')
    setCategory(ALL)
  }

  function countOf(name) {
    if (name === ALL) return entries.length
    return entries.filter((entry) => entry.category === name).length
  }

  return (
    <div>
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <LockIcon className="size-5" />
            </div>
            <h1 className="text-xl font-bold">Kasam</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/generator">
              <Button variant="secondary">Şifre Üretici</Button>
            </Link>
            <ThemeToggle />
            <Button variant="dangerSoft" onClick={handleLock}>
              <LockIcon />
              Kilitle
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Button onClick={() => setShowForm(true)} className="px-4 py-2.5">
            <PlusIcon />
            Yeni Kayıt
          </Button>

          <div className="relative min-w-60 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ara"
              className="pl-10"
            />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {[ALL, ...categories].map((name) => (
              <button
                key={name}
                onClick={() => setCategory(name)}
                className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  category === name
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {name}
                <span className="ml-1.5 opacity-50">{countOf(name)}</span>
              </button>
            ))}
          </div>
        )}

        {showForm && (
          <EntryForm
            key={editing ? editing.id : 'new'}
            entry={editing}
            onClose={handleClose}
          />
        )}

        {visibleEntries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {entries.length === 0
              ? 'Henüz kayıt yok. İlk parolanı ekleyerek başla.'
              : 'Eşleşen kayıt yok.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {visibleEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onEdit={handleEdit} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Dashboard
