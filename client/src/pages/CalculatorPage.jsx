import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { calculatorService } from '../services/calculator.service'
import { activityMultipliers, goalLabels } from '../utils/calculator'
import { Calculator, Droplets, Dumbbell, Flame } from 'lucide-react'

const CalculatorPage = () => {
  const { user } = useAuth()
  const [form, setForm] = useState({
    gender: user?.gender || 'male', age: user?.age || '', height: user?.height || '',
    weight: user?.weight || '', activity_level: user?.activity_level || 'moderately_active',
    goal: user?.goal || 'maintaining',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleCalc = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setResult(null)
    try {
      const res = await calculatorService.calculate(form)
      setResult(res.data.data)
    } catch (err) { setError(err.response?.data?.message || 'Gagal menghitung.')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">Kalkulator Kebugaran</h1>
        <p className="text-gray-400 text-sm mt-0.5">Hitung BMR, TDEE, kebutuhan makro & air</p>
      </div>

      <div className="card">
        <form onSubmit={handleCalc} className="space-y-4">
          {error && <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{error}</div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="male">Pria</option><option value="female">Wanita</option>
              </select>
            </div>
            <div><label className="label">Usia (thn)</label><input type="number" className="input" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required /></div>
            <div><label className="label">Tinggi (cm)</label><input type="number" className="input" value={form.height} onChange={e => setForm({...form, height: e.target.value})} required /></div>
            <div><label className="label">Berat (kg)</label><input type="number" step="0.1" className="input" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} required /></div>
          </div>
          <div>
            <label className="label">Level Aktivitas</label>
            <select className="input" value={form.activity_level} onChange={e => setForm({...form, activity_level: e.target.value})}>
              {Object.entries(activityMultipliers).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Tujuan</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(goalLabels).map(([k,v]) => (
                <button key={k} type="button" onClick={() => setForm({...form, goal: k})}
                  className={`py-2 rounded-lg border text-sm font-medium transition-all ${form.goal === k ? 'bg-brand-600/20 border-brand-600 text-brand-400' : 'border-surface-500 text-gray-400 hover:border-surface-400'}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
            <Calculator size={16} /> {loading ? 'Menghitung...' : 'Hitung Sekarang'}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Main results */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="stat-card border-brand-700/50 border">
              <span className="stat-label flex items-center gap-1"><Flame size={12} /> BMR</span>
              <span className="stat-value text-brand-400">{result.bmr}</span>
              <span className="text-xs text-gray-500">kcal/hari (istirahat total)</span>
            </div>
            <div className="stat-card border-blue-700/50 border">
              <span className="stat-label">TDEE</span>
              <span className="stat-value text-blue-400">{result.tdee}</span>
              <span className="text-xs text-gray-500">kcal/hari (maintenance)</span>
            </div>
            <div className="stat-card border-yellow-700/50 border col-span-2 md:col-span-1">
              <span className="stat-label">Target Kalori ({result.goal})</span>
              <span className="stat-value text-yellow-400">{result.target_calories}</span>
              <span className="text-xs text-gray-500">kcal/hari</span>
            </div>
          </div>

          {/* Macros */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Dumbbell size={15} className="text-brand-400" /> Kebutuhan Makronutrien</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-900/20 border border-blue-800/40 rounded-lg p-4 text-center">
                <p className="text-xs text-blue-400 uppercase tracking-wider">Protein</p>
                <p className="text-2xl font-bold font-mono text-white mt-1">{result.macros.protein}g</p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(result.macros.protein * 4)} kcal</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-lg p-4 text-center">
                <p className="text-xs text-yellow-400 uppercase tracking-wider">Karbo</p>
                <p className="text-2xl font-bold font-mono text-white mt-1">{result.macros.carbs}g</p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(result.macros.carbs * 4)} kcal</p>
              </div>
              <div className="bg-red-900/20 border border-red-800/40 rounded-lg p-4 text-center">
                <p className="text-xs text-red-400 uppercase tracking-wider">Lemak</p>
                <p className="text-2xl font-bold font-mono text-white mt-1">{result.macros.fat}g</p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(result.macros.fat * 9)} kcal</p>
              </div>
            </div>
          </div>

          {/* Water & Body stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card border-cyan-700/50 border">
              <span className="stat-label flex items-center gap-1"><Droplets size={12} /> Kebutuhan Air</span>
              <span className="stat-value text-cyan-400">{result.water_intake}L</span>
              <span className="text-xs text-gray-500">per hari</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">BMI</span>
              <span className="stat-value">{result.bmi}</span>
              <span className="text-xs text-gray-500">Est. body fat: {result.estimated_body_fat}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalculatorPage
