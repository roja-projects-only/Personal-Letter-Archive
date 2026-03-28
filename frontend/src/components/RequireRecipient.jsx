import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { recipientSession } from '../api/recipient'

export default function RequireRecipient() {
  const [state, setState] = useState('loading')

  useEffect(() => {
    recipientSession()
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
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
