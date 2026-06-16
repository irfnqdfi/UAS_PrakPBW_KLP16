import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profile.service'
import { activityMultipliers, goalLabels } from '../utils/calculator'
import { User, Lock, CheckCircle } from 'lucide-react'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '', gender: user?.gender || 'male',
    age: user?.age || '', height: user?.height || '',
    weight: user?.weight || '', activity_level: user?.activity_level || 'moderately_active',
    goal: user?.goal || 'maintaining',
  })
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' })
  const [saving, setSaving]   = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [msg, setMsg]         = useState('')
  const [msgPw, setMsgPw]     = useState('')
  const [err, setErr]         = useState('')
  const [errPw, setErrPw]     = useState('')

  const handleProfile = async (e) => {
    e.preventDefault(); setSaving(true); setErr(''); setMsg('')
    try {
      const res = await profileService.update(form)
      updateUser(res.data.data)
      setMsg('Profil berhasil diperbarui!')
    } catch (e) { setErr(e.response?.data?.message || 'Gagal menyimpan.')
    } finally { setSaving(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault(); setErrPw(''); setMsgPw('')
    if (pwForm.new_password !== pwForm.confirm) { setErrPw('Konfirmasi password tidak cocok.'); return }
    setSavingPw(true)
    try {
      await profileService.changePassword({ old_password: pwForm.old_password, new_password: pwForm.new_password })
      setMsgPw('Password berhasil diubah!')
      setPwForm({ old_password: '', new_password: '', confirm: '' })
    } catch (e) { setErrPw(e.response?.data?.message || 'Gagal mengubah password.')
    } finally { setSavingPw(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="page-title">Profil Saya</h1>

      {/* Profile form */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-brand-400" />
          <h2 className="font-semibold text-white">Data Diri & Fisik</h2>
        </div>
        {msg && <div className="mb-4 p-3 bg-brand-900/30 border border-brand-700/50 rounded-lg text-brand-400 text-sm flex items-center gap-2"><CheckCircle size={14} />{msg}</div>}
        {err && <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{err}</div>}
        <form onSubmit={handleProfile} className="space-y-4">
          <div>
            <label className="label">Nama Lengkap</label>
            <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-surface-900 cursor-not-allowed" value={user?.email} disabled />
            <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="male">Pria</option><option value="female">Wanita</option>
              </select>
            </div>
            <div><label className="label">Usia</label><input type="number" className="input" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required /></div>
            <div><label className="label">Tinggi (cm)</label><input type="number" className="input" value={form.height} onChange={e => setForm({...form, height: e.target.value})} required /></div>
            <div className="col-span-3 md:col-span-1"><label className="label">Berat (kg)</label><input type="number" step="0.1" className="input" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} required /></div>
          </div>
          <div>
            <label className="label">Level Aktivitas</label>
            <select className="input" value={form.activity_level} onChange={e => setForm({...form, activity_level: e.target.value})}>
              {Object.entries(activityMultipliers).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Tujuan Fitness</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(goalLabels).map(([k,v]) => (
                <button key={k} type="button" onClick={() => setForm({...form, goal: k})}
                  className={`py-2 rounded-lg border text-sm font-medium transition-all ${form.goal === k ? 'bg-brand-600/20 border-brand-600 text-brand-400' : 'border-surface-500 text-gray-400 hover:border-surface-400'}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
        </form>
      </div>

      {/* Password form */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={18} className="text-brand-400" />
          <h2 className="font-semibold text-white">Ubah Password</h2>
        </div>
        {msgPw && <div className="mb-4 p-3 bg-brand-900/30 border border-brand-700/50 rounded-lg text-brand-400 text-sm flex items-center gap-2"><CheckCircle size={14} />{msgPw}</div>}
        {errPw && <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm">{errPw}</div>}
        <form onSubmit={handlePassword} className="space-y-4">
          {[['old_password','Password Lama'],['new_password','Password Baru'],['confirm','Konfirmasi Password Baru']].map(([k,lbl]) => (
            <div key={k}>
              <label className="label">{lbl}</label>
              <input type="password" className="input" placeholder="••••••••" value={pwForm[k]}
                onChange={e => setPwForm({...pwForm, [k]: e.target.value})} required minLength={6} />
            </div>
          ))}
          <button type="submit" className="btn-primary w-full" disabled={savingPw}>{savingPw ? 'Mengubah...' : 'Ubah Password'}</button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
