import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFoundPage = () => (
  <div className="min-h-screen bg-surface-900 flex items-center justify-center">
    <div className="text-center">
      <p className="text-8xl font-bold text-brand-600 font-mono">404</p>
      <h1 className="text-2xl font-bold text-white mt-4">Halaman tidak ditemukan</h1>
      <p className="text-gray-400 mt-2">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 mt-6">
        <Home size={16} /> Kembali ke Dashboard
      </Link>
    </div>
  </div>
)

export default NotFoundPage
