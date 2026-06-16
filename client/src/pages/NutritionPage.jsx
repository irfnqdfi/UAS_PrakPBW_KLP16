import { useEffect, useState } from 'react'
import { nutritionService } from '../services/nutrition.service'
import { fmtDate } from '../utils/formatters'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const EMPTY = { calories: '', protein: '', carbs: '', fat: '', water_intake: '', meal_notes: '' }

const NutritionPage = () => {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = async () => { try { const r = await nutritionService.getAll(); setData(r.data.data) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit   = (item) => { setEditing(item); setForm({ calories: item.calories, protein: item.protein, carbs: item.carbs, fat: item.fat, water_intake: item.water_intake, meal_notes: item.meal_notes || '' }); setError(''); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (editing) await nutritionService.update(editing.id, form)
      else         await nutritionService.create(form)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.message || 'Gagal menyimpan.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => { if (!confirm('Hapus log ini?')) return; await nutritionService.remove(id); load() }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Log Nutrisi</h1><p className="text-gray-400 text-sm mt-0.5">Pantau asupan kalori & makro harian</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Catat Nutrisi</button>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Tanggal</th><th>Kalori</th><th>Protein</th><th>Karbo</th><th>Lemak</th><th>Air</th><th>Aksi</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-8 text-gray-500">Memuat...</td></tr>
              : data.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-500">Belum ada log nutrisi</td></tr>
              : data.map(d => (
                <tr key={d.id}>
                  <td>{fmtDate(d.logged_at)}</td>
                  <td className="font-mono font-semibold text-white">{Math.round(d.calories)} kcal</td>
                  <td className="text-blue-400 font-mono">{d.protein}g</td>
                  <td className="text-yellow-400 font-mono">{d.carbs}g</td>
                  <td className="text-red-400 font-mono">{d.fat}g</td>
                  <td className="font-mono">{d.water_intake}L</td>
                  <td><div className="flex gap-2">
                    <button onClick={() => openEdit(d)} className="text-gray-400 hover:text-brand-400"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-surface-800 border border-surface-600 rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-surface-600">
              <h2 className="font-semibold text-white">{editing ? 'Edit Log Nutrisi' : 'Catat Nutrisi Harian'}</h2>
              <button onClick={() => setModal(false)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                {[['calories','Kalori (kcal)','2800'],['protein','Protein (g)','160'],['carbs','Karbohidrat (g)','320'],['fat','Lemak (g)','80'],['water_intake','Air (liter)','3.0']].map(([k,lbl,ph]) => (
                  <div key={k} className={k === 'water_intake' ? 'col-span-2' : ''}>
                    <label className="label">{lbl} *</label>
                    <input type="number" step="0.1" className="input" placeholder={ph}
                      value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} required />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="label">Catatan Makan</label>
                  <textarea className="input resize-none" rows={2} placeholder="Sarapan: nasi + telur..."
                    value={form.meal_notes} onChange={e => setForm({...form, meal_notes: e.target.value})} />
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
export default NutritionPage
