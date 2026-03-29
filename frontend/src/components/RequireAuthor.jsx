import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { me } from '../api/auth'
import LoadingIndicator from './LoadingIndicator'

export default function RequireAuthor() {
  const [state, setState] = useState('loading')

  useEffect(() => {
    me()
      .then(() => setState('ok'))
      .catch(() => setState('no'))
  }, [])

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingIndicator message="" />
      </div>
    )
  }

  if (state === 'no') {
    return <Navigate to="/write" replace />
  }

  return <Outlet />
}
