import { useEffect, useState } from 'react'
import { goalService } from '../services/goal.service'
import { fmtDate, fmtKg, fmtKcal } from '../utils/formatters'
import { goalLabels } from '../utils/calculator'
import { Plus, Pencil, Trash2, X, CheckCircle } from 'lucide-react'

const EMPTY = { goal_type: 'bulking', target_weight: '', target_body_fat: '', target_calories: '', target_protein: '', target_water: '', deadline: '', notes: '' }

const GoalsPage = () => {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = async () => { try { const r = await goalService.getAll(); setData(r.data.data) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit   = (item) => {
    setEditing(item)
    setForm({ goal_type: item.goal_type, target_weight: item.target_weight || '', target_body_fat: item.target_body_fat || '', target_calories: item.target_calories || '', target_protein: item.target_protein || '', target_water: item.target_water || '', deadline: item.deadline ? item.deadline.slice(0,10) : '', notes: item.notes || '' })
    setError(''); setModal(true)
  }
  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try { if (editing) await goalService.update(editing.id, form); else await goalService.create(form); setModal(false); load() }
    catch (err) { setError(err.response?.data?.message || 'Gagal menyimpan.') }
    finally { setSaving(false) }
  }
  const handleDelete = async (id) => { if (!confirm('Hapus goal ini?')) return; await goalService.remove(id); load() }
  const toggleActive = async (item) => { await goalService.update(item.id, { is_active: !item.is_active }); load() }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Target Fitness</h1><p className="text-gray-400 text-sm mt-0.5">Tetapkan dan pantau target kebugaran kamu</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Buat Target</button>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Memuat...</div>
      : data.length === 0 ? <div className="card text-center py-12"><p className="text-gray-500">Belum ada target. Buat target pertamamu!</p></div>
      : <div className="grid gap-4">
        {data.map(g => {
          const gl = goalLabels[g.goal_type]
          return (
            <div key={g.id} className={`card border ${g.is_active ? 'border-brand-700/50' : 'border-surface-600 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={gl?.color}>{gl?.label}</span>
                  {g.is_active && <span className="badge-green flex items-center gap-1"><CheckCircle size={10} /> Aktif</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(g)} className="text-xs text-gray-400 hover:text-brand-400">{g.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                  <button onClick={() => openEdit(g)} className="text-gray-400 hover:text-brand-400"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(g.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {g.target_weight && <div className="bg-surface-700 rounded-lg p-3"><p className="text-xs text-gray-400">Target Berat</p><p className="font-bold text-white mt-1">{fmtKg(g.target_weight)}</p></div>}
                {g.target_calories && <div className="bg-surface-700 rounded-lg p-3"><p className="text-xs text-gray-400">Target Kalori</p><p className="font-bold text-white mt-1">{fmtKcal(g.target_calories)}</p></div>}
                {g.target_protein && <div className="bg-surface-700 rounded-lg p-3"><p className="text-xs text-gray-400">Target Protein</p><p className="font-bold text-white mt-1">{g.target_protein}g</p></div>}
                {g.deadline && <div className="bg-surface-700 rounded-lg p-3"><p className="text-xs text-gray-400">Deadline</p><p className="font-bold text-white mt-1">{fmtDate(g.deadline)}</p></div>}
              </div>
              {g.notes && <p className="text-sm text-gray-400 mt-3">{g.notes}</p>}
            </div>
          )
        })}
      </div>}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-surface-800 border border-surface-600 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-surface-600">
              <h2 className="font-semibold text-white">{editing ? 'Edit Target' : 'Buat Target Baru'}</h2>
              <button onClick={() => setModal(false)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{error}</div>}
              <div>
                <label className="label">Tipe Goal *</label>
                <select className="input" value={form.goal_type} onChange={e => setForm({...form, goal_type: e.target.value})}>
                  {Object.entries(goalLabels).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['target_weight','Target Berat (kg)','75'],['target_body_fat','Target Body Fat (%)','15'],['target_calories','Target Kalori (kcal)','2800'],['target_protein','Target Protein (g)','160'],['target_water','Target Air (L)','3.0']].map(([k,lbl,ph]) => (
                  <div key={k}><label className="label">{lbl}</label><input type="number" step="0.1" className="input" placeholder={ph} value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} /></div>
                ))}
                <div><label className="label">Deadline</label><input type="date" className="input" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} /></div>
              </div>
              <div><label className="label">Catatan</label><textarea className="input resize-none" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
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
export default GoalsPage
