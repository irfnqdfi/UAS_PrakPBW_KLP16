import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap } from 'lucide-react'
import { activityMultipliers, goalLabels } from '../utils/calculator'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', gender: 'male',
    age: '', height: '', weight: '',
    activity_level: 'moderately_active', goal: 'maintaining',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mb-3">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Buat Akun GymTrack</h1>
          <p className="text-gray-400 text-sm mt-1">Mulai perjalanan fitness kamu</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Nama Lengkap</label>
                <input className="input" placeholder="John Doe" value={form.name}
                  onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="col-span-2">
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="email@example.com" value={form.email}
                  onChange={e => set('email', e.target.value)} required />
              </div>
              <div className="col-span-2">
                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Min. 6 karakter" value={form.password}
                  onChange={e => set('password', e.target.value)} minLength={6} required />
              </div>
            </div>

            <hr className="border-surface-600" />
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Data Fisik</p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Gender</label>
                <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="male">Pria</option>
                  <option value="female">Wanita</option>
                </select>
              </div>
              <div>
                <label className="label">Usia (thn)</label>
                <input type="number" className="input" placeholder="21" min="10" max="100"
                  value={form.age} onChange={e => set('age', e.target.value)} required />
              </div>
              <div>
                <label className="label">Tinggi (cm)</label>
                <input type="number" className="input" placeholder="170" min="100" max="250"
                  value={form.height} onChange={e => set('height', e.target.value)} required />
              </div>
              <div>
                <label className="label">Berat (kg)</label>
                <input type="number" className="input" placeholder="65" min="30" max="300" step="0.1"
                  value={form.weight} onChange={e => set('weight', e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label">Level Aktivitas</label>
              <select className="input" value={form.activity_level} onChange={e => set('activity_level', e.target.value)}>
                {Object.entries(activityMultipliers).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tujuan Fitness</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(goalLabels).map(([k, v]) => (
                  <button key={k} type="button"
                    onClick={() => set('goal', k)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      form.goal === k
                        ? 'bg-brand-600/20 border-brand-600 text-brand-400'
                        : 'border-surface-500 text-gray-400 hover:border-surface-400'
                    }`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Membuat akun...' : 'Buat Akun'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
