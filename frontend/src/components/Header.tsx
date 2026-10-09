import { NavLink, Link } from 'react-router'

const NAV = [
  { to: '/premios', label: 'Premios' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/explorador', label: 'Explorador' },
  { to: '/admin', label: 'Admin', adminOnly: true },
]

// TODO: reemplazar por el usuario autenticado
const user = { name: 'Franco', wallet: '0x3f2a…9c1e', isAdmin: true }

export default function Header() {
  return (
    <header className="bg-ink border-b-4 border-scesi text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/premios" className="text-xl font-semibold">
          SCESI <span className="text-scesi">Coin</span>
        </Link>
        <nav className="flex gap-1">
          {NAV.filter((item) => !item.adminOnly || user.isAdmin).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-md px-4 font-medium ${
                  isActive ? 'bg-scesi' : 'hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/panel" aria-label="Mi panel" className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="font-medium">{user.name}</p>
            <p className="font-mono text-xs text-white/70">{user.wallet}</p>
          </div>
          <div className="bg-scesi size-10 rounded-full" />
        </Link>
      </div>
    </header>
  )
}
