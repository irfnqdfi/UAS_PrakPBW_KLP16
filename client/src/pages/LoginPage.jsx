import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff } from 'lucide-react'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email & password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mb-3">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">GymTrack</h1>
          <p className="text-gray-400 text-sm mt-1">Masuk ke akun kamu</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="email@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-10" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-4">
            Belum punya akun?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">Daftar sekarang</Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-surface-800 border border-surface-600 rounded-lg text-xs text-gray-500 text-center">
          Demo: <span className="text-gray-300">irfan@gymtrack.com</span> / <span className="text-gray-300">password123</span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
