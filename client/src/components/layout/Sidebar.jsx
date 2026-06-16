import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Ruler, Dumbbell, UtensilsCrossed,
  Target, Bell, Calculator, User, LogOut, Zap
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard,  label: 'Dashboard'     },
  { to: '/calculator',   icon: Calculator,        label: 'Kalkulator'    },
  { to: '/measurements', icon: Ruler,             label: 'Pengukuran'    },
  { to: '/workout',      icon: Dumbbell,          label: 'Latihan'       },
  { to: '/nutrition',    icon: UtensilsCrossed,   label: 'Nutrisi'       },
  { to: '/goals',        icon: Target,            label: 'Target'        },
  { to: '/reminders',    icon: Bell,              label: 'Pengingat'     },
  { to: '/profile',      icon: User,              label: 'Profil'        },
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-surface-800 border-r border-surface-600 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">GymTrack</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-surface-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center text-brand-300 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.goal}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-400 border border-brand-700/50'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-700'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-surface-600">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-150">
          <LogOut size={17} />
          Keluar
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
