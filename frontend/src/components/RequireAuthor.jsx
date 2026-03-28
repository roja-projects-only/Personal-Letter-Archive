import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { me } from '../api/auth'

export default function RequireAuthor() {
  const [state, setState] = useState('loading')

  useEffect(() => {
    me()
      .then(() => setState('ok'))
      .catch(() => setState('no'))
  }, [])

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream font-sans text-sm text-ink-muted">
        …
      </div>
    )
  }

  if (state === 'no') {
    return <Navigate to="/write" replace />
  }

  return <Outlet />
}
