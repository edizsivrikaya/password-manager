import { Link } from 'react-router'
import Button from '../components/Button'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-6xl font-bold text-slate-300 dark:text-slate-700">404</p>
      <h1 className="text-xl font-semibold">Aradığın sayfa bulunamadı</h1>
      <Link to="/unlock">
        <Button>Ana sayfaya dön</Button>
      </Link>
    </div>
  )
}

export default NotFound
