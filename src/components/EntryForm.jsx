import { useState } from 'react'
import { useVaultStore } from '../store/vaultStore'
import { useToastStore } from '../store/toastStore'
import Button from './Button'
import Input from './Input'

const EMPTY_FORM = { title: '', username: '', category: '', password: '' }

function initialValues(entry) {
  if (!entry) {
    return EMPTY_FORM
  }

  return {
    title: entry.title,
    username: entry.username,
    category: entry.category,
    password: entry.password,
  }
}

function EntryForm({ entry, onClose }) {
  const addEntry = useVaultStore((state) => state.addEntry)
  const updateEntry = useVaultStore((state) => state.updateEntry)
  const showToast = useToastStore((state) => state.showToast)

  const [form, setForm] = useState(initialValues(entry))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [visible, setVisible] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (form.title === '' || form.password === '') {
      setError('Başlık ve parola zorunlu.')
      return
    }

    setBusy(true)

    if (entry) {
      await updateEntry(entry.id, form)
      showToast('Kayıt güncellendi')
    } else {
      await addEntry(form)
      showToast('Kayıt eklendi')
    }

    onClose()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="mb-4 text-lg font-bold">
        {entry ? 'Kaydı Düzenle' : 'Yeni Kayıt'}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Başlık"
          autoFocus
        />
        <Input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Kullanıcı adı"
        />
        <Input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Kategori"
        />

        <div className="flex gap-2">
          <Input
            name="password"
            type={visible ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="Parola"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setVisible(!visible)}
            className="shrink-0"
          >
            {visible ? 'Gizle' : 'Göster'}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          İptal
        </Button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  )
}

export default EntryForm
