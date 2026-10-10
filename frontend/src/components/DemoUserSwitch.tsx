import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useMembers } from '@/api/admin'
import { useMe } from '@/api/me'
import { setMockUser } from '@/api/mock'

// Solo para la demo mientras no exista login: borrar cuando el backend tenga autenticación
export default function DemoUserSwitch() {
  const { data: members = [] } = useMembers()
  const { data: me } = useMe()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="demo-user" className="text-ink-2">
        Ver como (demo)
      </label>
      <select
        id="demo-user"
        value={me?.handle ?? ''}
        onChange={(e) => {
          setMockUser(e.target.value)
          queryClient.invalidateQueries()
          navigate('/panel')
        }}
        className="border-input text-ink min-h-11 rounded-lg border bg-white px-3 text-sm"
      >
        {members.map((m) => (
          <option key={m.handle} value={m.handle}>
            {m.nombre}
            {m.handle === 'shamir' ? ' (directiva)' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
