import { useEffect, useState } from 'react'
import { workoutService } from '../services/workout.service'
import { fmtDate } from '../utils/formatters'
import { categoryLabels } from '../utils/calculator'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const CATEGORIES = Object.entries(categoryLabels)
const EMPTY = { session_name: '', category: 'chest', exercise_name: '', sets: '', reps: '', weight_used: '', duration_min: '', notes: '' }

const WorkoutPage = () => {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [filterCat, setFilterCat] = useState('')

  const load = async () => {
    try {
      const res = await workoutService.getAll(filterCat ? { category: filterCat } : {})
      setData(res.data.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filterCat])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit   = (item) => {
    setEditing(item)
    setForm({
      session_name: item.session_name || '', category: item.category,
      exercise_name: item.exercise_name, sets: item.sets, reps: item.reps,
      weight_used: item.weight_used || '', duration_min: item.duration_min || '', notes: item.notes || '',
    })
    setError(''); setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (editing) await workoutService.update(editing.id, form)
      else         await workoutService.create(form)
      setModal(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus log latihan ini?')) return
    await workoutService.remove(id); load()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Log Latihan</h1>
          <p className="text-gray-400 text-sm mt-0.5">Catat setiap sesi latihan kamu</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Latihan
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterCat('')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!filterCat ? 'bg-brand-600 text-white' : 'bg-surface-700 text-gray-400 hover:text-gray-200'}`}>
          Semua
        </button>
        {CATEGORIES.map(([k, v]) => (
          <button key={k} onClick={() => setFilterCat(k)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filterCat === k ? 'bg-brand-600 text-white' : 'bg-surface-700 text-gray-400 hover:text-gray-200'}`}>
            {v}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Tanggal</th><th>Sesi</th><th>Latihan</th><th>Kategori</th><th>Sets×Reps</th><th>Beban</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Memuat...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Belum ada log latihan</td></tr>
              ) : data.map(d => (
                <tr key={d.id}>
                  <td className="text-xs">{fmtDate(d.logged_at)}</td>
                  <td className="text-gray-400 text-xs">{d.session_name || '—'}</td>
                  <td className="font-medium text-white">{d.exercise_name}</td>
                  <td><span className="badge-blue">{categoryLabels[d.category]}</span></td>
                  <td className="font-mono text-sm">{d.sets}×{d.reps}</td>
                  <td className="font-mono text-sm text-brand-400">
                    {d.weight_used ? `${d.weight_used}kg` : d.duration_min ? `${d.duration_min}min` : '—'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(d)} className="text-gray-400 hover:text-brand-400 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-surface-800 border border-surface-600 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-surface-600">
              <h2 className="font-semibold text-white">{editing ? 'Edit Latihan' : 'Tambah Latihan'}</h2>
              <button onClick={() => setModal(false)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Nama Sesi (opsional)</label>
                  <input className="input" placeholder="Push Day, Leg Day, dll."
                    value={form.session_name} onChange={e => setForm({...form, session_name: e.target.value})} />
                </div>
                <div>
                  <label className="label">Kategori *</label>
                  <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Nama Latihan *</label>
                  <input className="input" placeholder="Bench Press"
                    value={form.exercise_name} onChange={e => setForm({...form, exercise_name: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Sets *</label>
                  <input type="number" min="1" className="input" placeholder="4"
                    value={form.sets} onChange={e => setForm({...form, sets: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Reps *</label>
                  <input type="number" min="1" className="input" placeholder="8"
                    value={form.reps} onChange={e => setForm({...form, reps: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Beban (kg)</label>
                  <input type="number" step="0.5" className="input" placeholder="60"
                    value={form.weight_used} onChange={e => setForm({...form, weight_used: e.target.value})} />
                </div>
                <div>
                  <label className="label">Durasi (menit, kardio)</label>
                  <input type="number" className="input" placeholder="30"
                    value={form.duration_min} onChange={e => setForm({...form, duration_min: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="label">Catatan</label>
                  <textarea className="input resize-none" rows={2}
                    value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutPage
