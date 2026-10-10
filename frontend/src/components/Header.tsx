import { Link, NavLink, useMatch } from 'react-router'
import { useMe } from '@/api/me'
import { shortWallet } from '@/lib/format'

const NAV = [
  { to: '/premios', label: 'Premios' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/explorador', label: 'Explorador' },
  { to: '/admin', label: 'Admin', adminOnly: true },
]

export default function Header() {
  const { data: me } = useMe()
  const isAdmin = me?.rol === 'DIRECTIVA'
  // En Mi panel el perfil ya está en pantalla; se oculta sin quitarlo para que la navegación no se mueva
  const onPanel = useMatch('/panel') !== null

  return (
    <header className="bg-ink border-scesi flex-none border-b-[3px]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/panel" className="text-[22px] font-bold tracking-tight text-white">
          SCESI <span className="text-scesi-bright">Coin</span>
        </Link>
        <nav className="flex flex-wrap gap-1 text-[15px]">
          {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => (
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
        {me && (
          <Link
            to="/panel"
            aria-label="Mi panel"
            className={`flex items-center gap-2.5 text-sm ${onPanel ? 'invisible' : ''}`}
          >
            <div className="text-right">
              <div className="font-semibold text-white">{me.nombre}</div>
              <div className="font-mono text-[13px] text-[#B5B5B5]">{shortWallet(me.wallet)}</div>
            </div>
            <div className="bg-scesi ring-scesi flex size-10 items-center justify-center rounded-full border-[3px] border-white font-semibold text-white ring-2">
              {me.nombre[0]}
            </div>
          </Link>
        )}
      </div>
    </header>
  )
}
