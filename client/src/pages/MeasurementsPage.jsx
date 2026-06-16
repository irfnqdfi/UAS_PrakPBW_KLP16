import { useEffect, useState } from 'react'
import { measurementService } from '../services/measurement.service'
import { fmtDate, fmtKg, fmtPct, fmtCm } from '../utils/formatters'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const EMPTY = { weight: '', body_fat_pct: '', chest: '', waist: '', hips: '', arms: '', thighs: '', notes: '' }

const MeasurementsPage = () => {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = async () => {
    try {
      const res = await measurementService.getAll()
      setData(res.data.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit   = (item) => { setEditing(item); setForm({
    weight: item.weight, body_fat_pct: item.body_fat_pct || '',
    chest: item.chest || '', waist: item.waist || '', hips: item.hips || '',
    arms: item.arms || '', thighs: item.thighs || '', notes: item.notes || '',
  }); setError(''); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (editing) await measurementService.update(editing.id, form)
      else         await measurementService.create(form)
      setModal(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus data ini?')) return
    await measurementService.remove(id)
    load()
  }

  // Chart data (oldest to newest)
  const chartData = [...data].reverse().map(d => ({
    date: fmtDate(d.recorded_at),
    berat: d.weight,
    lemak: d.body_fat_pct,
  }))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pengukuran Tubuh</h1>
          <p className="text-gray-400 text-sm mt-0.5">Pantau perubahan berat & komposisi tubuh</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Catat Pengukuran
        </button>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Grafik Berat Badan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8 }}
                labelStyle={{ color: '#e5e7eb' }} itemStyle={{ color: '#4ade80' }} />
              <Line type="monotone" dataKey="berat" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} name="Berat (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th><th>Berat</th><th>Body Fat</th><th>Lean Mass</th>
                <th>Pinggang</th><th>Dada</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Memuat...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Belum ada data pengukuran</td></tr>
              ) : data.map(d => (
                <tr key={d.id}>
                  <td>{fmtDate(d.recorded_at)}</td>
                  <td className="font-mono font-semibold text-white">{fmtKg(d.weight)}</td>
                  <td>{fmtPct(d.body_fat_pct)}</td>
                  <td>{fmtKg(d.lean_mass)}</td>
                  <td>{fmtCm(d.waist)}</td>
                  <td>{fmtCm(d.chest)}</td>
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
              <h2 className="font-semibold text-white">{editing ? 'Edit Pengukuran' : 'Catat Pengukuran Baru'}</h2>
              <button onClick={() => setModal(false)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Berat Badan (kg) *</label>
                  <input type="number" step="0.1" className="input" placeholder="68.5"
                    value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Body Fat (%)</label>
                  <input type="number" step="0.1" className="input" placeholder="18.0"
                    value={form.body_fat_pct} onChange={e => setForm({...form, body_fat_pct: e.target.value})} />
                </div>
                {[['chest','Dada (cm)'],['waist','Pinggang (cm)'],['hips','Pinggul (cm)'],['arms','Lengan (cm)'],['thighs','Paha (cm)']].map(([k, lbl]) => (
                  <div key={k}>
                    <label className="label">{lbl}</label>
                    <input type="number" step="0.1" className="input" value={form[k]}
                      onChange={e => setForm({...form, [k]: e.target.value})} />
                  </div>
                ))}
              </div>
              <div>
                <label className="label">Catatan</label>
                <textarea className="input resize-none" rows={2} placeholder="Catatan opsional..."
                  value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
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

export default MeasurementsPage
