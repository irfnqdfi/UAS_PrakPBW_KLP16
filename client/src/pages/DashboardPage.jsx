import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { measurementService } from '../services/measurement.service'
import { nutritionService }   from '../services/nutrition.service'
import { workoutService }     from '../services/workout.service'
import { goalService }        from '../services/goal.service'
import { reminderService }    from '../services/reminder.service'
import { fmtKg, fmtKcal, fmtDate } from '../utils/formatters'
import { goalLabels, categoryLabels, reminderTypeLabels } from '../utils/calculator'
import { Dumbbell, UtensilsCrossed, Ruler, Target, Bell, ArrowRight, TrendingUp } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuth()
  const [data, setData] = useState({
    latestMeasurement: null,
    todayNutrition: null,
    recentWorkouts: [],
    activeGoal: null,
    todayReminders: [],
    loading: true,
  })

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [mRes, nRes, wRes, gRes, rRes] = await Promise.all([
          measurementService.getAll(),
          nutritionService.getAll(),
          workoutService.getAll(),
          goalService.getAll(),
          reminderService.getAll(),
        ])
        const today = new Date().toDateString()
        setData({
          latestMeasurement: mRes.data.data[0] || null,
          todayNutrition: nRes.data.data.find(n => new Date(n.logged_at).toDateString() === today) || null,
          recentWorkouts: wRes.data.data.slice(0, 5),
          activeGoal: gRes.data.data.find(g => g.is_active) || null,
          todayReminders: rRes.data.data.filter(r => r.is_active).slice(0, 5),
          loading: false,
        })
      } catch { setData(d => ({ ...d, loading: false })) }
    }
    loadAll()
  }, [])

  const goal = goalLabels[user?.goal]
  const dayName = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })

  if (data.loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-gray-400 text-sm">{dayName}</p>
        <h1 className="text-2xl font-bold text-white mt-0.5">
          Halo, {user?.name?.split(' ')[0]}! 💪
        </h1>
        {goal && <span className={`mt-1 ${goal.color}`}>{goal.label} — {goal.desc}</span>}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="stat-label">Berat Saat Ini</span>
          <span className="stat-value">{fmtKg(data.latestMeasurement?.weight) || fmtKg(user?.weight)}</span>
          <span className="text-xs text-gray-500">{data.latestMeasurement ? fmtDate(data.latestMeasurement.recorded_at) : 'Data awal'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Kalori Hari Ini</span>
          <span className="stat-value">{data.todayNutrition ? fmtKcal(data.todayNutrition.calories) : '—'}</span>
          <span className="text-xs text-gray-500">{data.todayNutrition ? 'Sudah dicatat' : 'Belum dicatat'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Body Fat</span>
          <span className="stat-value">{data.latestMeasurement?.body_fat_pct ? `${data.latestMeasurement.body_fat_pct}%` : '—'}</span>
          <span className="text-xs text-gray-500">Pengukuran terakhir</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sesi Latihan</span>
          <span className="stat-value">{data.recentWorkouts.length}</span>
          <span className="text-xs text-gray-500">Log terbaru</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Workouts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell size={16} className="text-brand-400" />
              <h3 className="font-semibold text-white text-sm">Latihan Terbaru</h3>
            </div>
            <Link to="/workout" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              Lihat semua <ArrowRight size={12} />
            </Link>
          </div>
          {data.recentWorkouts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada log latihan</p>
          ) : (
            <ul className="space-y-2">
              {data.recentWorkouts.map(w => (
                <li key={w.id} className="flex items-center justify-between py-1.5 border-b border-surface-700 last:border-0">
                  <div>
                    <p className="text-sm text-white font-medium">{w.exercise_name}</p>
                    <p className="text-xs text-gray-400">{categoryLabels[w.category]} · {w.sets}×{w.reps}</p>
                  </div>
                  {w.weight_used && <span className="text-xs text-brand-400 font-mono">{w.weight_used}kg</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Today's Reminders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-brand-400" />
              <h3 className="font-semibold text-white text-sm">Pengingat Aktif</h3>
            </div>
            <Link to="/reminders" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              Kelola <ArrowRight size={12} />
            </Link>
          </div>
          {data.todayReminders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada pengingat</p>
          ) : (
            <ul className="space-y-2">
              {data.todayReminders.map(r => {
                const rt = reminderTypeLabels[r.type]
                return (
                  <li key={r.id} className="flex items-center gap-3 py-1.5 border-b border-surface-700 last:border-0">
                    <span className="text-lg">{rt?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{r.label}</p>
                      <p className="text-xs text-gray-400">{r.time} · {r.days}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Active Goal */}
        {data.activeGoal && (
          <div className="card md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-brand-400" />
              <h3 className="font-semibold text-white text-sm">Target Aktif</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.activeGoal.target_weight && (
                <div className="bg-surface-700 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Target Berat</p>
                  <p className="text-lg font-bold text-white mt-1">{data.activeGoal.target_weight} kg</p>
                </div>
              )}
              {data.activeGoal.target_calories && (
                <div className="bg-surface-700 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Target Kalori</p>
                  <p className="text-lg font-bold text-white mt-1">{data.activeGoal.target_calories} kcal</p>
                </div>
              )}
              {data.activeGoal.target_protein && (
                <div className="bg-surface-700 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Target Protein</p>
                  <p className="text-lg font-bold text-white mt-1">{data.activeGoal.target_protein} g</p>
                </div>
              )}
              {data.activeGoal.deadline && (
                <div className="bg-surface-700 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Deadline</p>
                  <p className="text-lg font-bold text-white mt-1">{fmtDate(data.activeGoal.deadline)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/measurements', icon: Ruler, label: 'Catat Berat', color: 'text-blue-400' },
            { to: '/workout', icon: Dumbbell, label: 'Log Latihan', color: 'text-green-400' },
            { to: '/nutrition', icon: UtensilsCrossed, label: 'Log Nutrisi', color: 'text-yellow-400' },
            { to: '/calculator', icon: TrendingUp, label: 'Kalkulator', color: 'text-purple-400' },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to}
              className="card-hover flex flex-col items-center gap-2 py-4 text-center">
              <Icon size={22} className={color} />
              <span className="text-sm text-gray-300 font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
