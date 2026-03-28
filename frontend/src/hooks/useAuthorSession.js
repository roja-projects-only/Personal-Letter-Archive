import { useCallback, useEffect, useState } from 'react'
import { me } from '../api/auth'

export function useAuthorSession() {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)

  const refresh = useCallback(() => {
    setStatus('loading')
    return me()
      .then((res) => {
        setUser(res.data)
        setStatus('authed')
        return res.data
      })
      .catch(() => {
        setUser(null)
        setStatus('anon')
        return null
      })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { status, user, refresh, isLoading: status === 'loading', isAuthed: status === 'authed' }
}
