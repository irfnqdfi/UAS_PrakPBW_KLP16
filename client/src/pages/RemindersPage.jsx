import { useEffect, useState } from 'react'
import { reminderService } from '../services/reminder.service'
import { reminderTypeLabels } from '../utils/calculator'
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react'

const DAYS_OPTIONS = ['mon','tue','wed','thu','fri','sat','sun']
const DAYS_ID = { mon:'Sen', tue:'Sel', wed:'Rab', thu:'Kam', fri:'Jum', sat:'Sab', sun:'Min' }
const EMPTY = { type: 'workout', label: '', time: '07:00', days: 'everyday' }

const RemindersPage = () => {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [selectedDays, setSelectedDays] = useState([])
  const [everyday, setEveryday]         = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = async () => { try { const r = await reminderService.getAll(); setData(r.data.data) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setSelectedDays([]); setEveryday(true); setError(''); setModal(true)
  }
  const openEdit = (item) => {
    setEditing(item)
    setForm({ type: item.type, label: item.label, time: item.time, days: item.days })
    const isEvery = item.days === 'everyday'
    setEveryday(isEvery)
    setSelectedDays(isEvery ? [] : item.days.split(','))
    setError(''); setModal(true)
  }

  const toggleDay = (d) => {
    setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    const days = everyday ? 'everyday' : selectedDays.join(',')
    if (!everyday && selectedDays.length === 0) { setError('Pilih minimal 1 hari.'); setSaving(false); return }
    try {
      const payload = { ...form, days }
      if (editing) await reminderService.update(editing.id, payload)
      else         await reminderService.create(payload)
      setModal(false); load()
    } catch (err) { setError(err.response?.data?.message || 'Gagal menyimpan.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => { if (!confirm('Hapus pengingat ini?')) return; await reminderService.remove(id); load() }
  const toggleActive = async (item) => { await reminderService.update(item.id, { is_active: !item.is_active }); load() }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Pengingat</h1><p className="text-gray-400 text-sm mt-0.5">Atur jadwal latihan, air, protein & progress</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Tambah Pengingat</button>
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Memuat...</div>
      : data.length === 0 ? <div className="card text-center py-12"><p className="text-gray-500">Belum ada pengingat.</p></div>
      : <div className="space-y-3">
        {data.map(r => {
          const rt = reminderTypeLabels[r.type]
          return (
            <div key={r.id} className={`card flex items-center gap-4 ${!r.is_active ? 'opacity-50' : ''}`}>
              <span className="text-2xl">{rt?.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{r.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-brand-400">{r.time}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-xs text-gray-400">
                    {r.days === 'everyday' ? 'Setiap hari' : r.days.split(',').map(d => DAYS_ID[d]).join(', ')}
                  </span>
                  <span className={rt?.color}>{rt?.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(r)} className="text-gray-400 hover:text-brand-400 transition-colors">
                  {r.is_active ? <ToggleRight size={22} className="text-brand-400" /> : <ToggleLeft size={22} />}
                </button>
                <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-brand-400"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          )
        })}
      </div>}

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-surface-800 border border-surface-600 rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-surface-600">
              <h2 className="font-semibold text-white">{editing ? 'Edit Pengingat' : 'Tambah Pengingat'}</h2>
              <button onClick={() => setModal(false)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{error}</div>}
              <div>
                <label className="label">Tipe *</label>
                <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {Object.entries(reminderTypeLabels).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Label *</label>
                <input className="input" placeholder="Minum air pagi" value={form.label}
                  onChange={e => setForm({...form, label: e.target.value})} required />
              </div>
              <div>
                <label className="label">Waktu *</label>
                <input type="time" className="input" value={form.time}
                  onChange={e => setForm({...form, time: e.target.value})} required />
              </div>
              <div>
                <label className="label">Hari</label>
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" id="everyday" checked={everyday} onChange={e => { setEveryday(e.target.checked); if (e.target.checked) setSelectedDays([]) }} className="w-4 h-4 accent-green-500" />
                  <label htmlFor="everyday" className="text-sm text-gray-300">Setiap hari</label>
                </div>
                {!everyday && (
                  <div className="flex gap-1.5 flex-wrap">
                    {DAYS_OPTIONS.map(d => (
                      <button key={d} type="button" onClick={() => toggleDay(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedDays.includes(d) ? 'bg-brand-600 text-white' : 'bg-surface-700 text-gray-400 hover:text-gray-200'}`}>
                        {DAYS_ID[d]}
                      </button>
                    ))}
                  </div>
                )}
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
export default RemindersPage
