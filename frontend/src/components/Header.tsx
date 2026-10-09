import { Link, NavLink } from 'react-router'

const NAV = [
  { to: '/premios', label: 'Premios' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/explorador', label: 'Explorador' },
  { to: '/admin', label: 'Admin', adminOnly: true },
]

// TODO: reemplazar por el usuario autenticado
const user = { name: 'Franco', wallet: '0x7a3f…c91e', isAdmin: true }

export default function Header() {
  return (
    <header className="bg-ink border-scesi flex-none border-b-[3px]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/panel" className="text-[22px] font-bold tracking-tight text-white">
          SCESI <span className="text-scesi-bright">Coin</span>
        </Link>
        <nav className="flex flex-wrap gap-1 text-[15px]">
          {NAV.filter((item) => !item.adminOnly || user.isAdmin).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-11 items-center rounded-md px-4 ${
                  isActive
                    ? 'bg-scesi font-semibold text-white'
                    : 'font-medium text-[#E6E6E6] hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/panel" aria-label="Mi panel" className="flex items-center gap-2.5 text-sm">
          <div className="text-right">
            <div className="font-semibold text-white">{user.name}</div>
            <div className="font-mono text-[13px] text-[#B5B5B5]">{user.wallet}</div>
          </div>
          <div className="bg-scesi ring-scesi flex size-10 items-center justify-center rounded-full border-[3px] border-white font-semibold text-white ring-2">
            {user.name[0]}
          </div>
        </Link>
      </div>
    </header>
  )
}
