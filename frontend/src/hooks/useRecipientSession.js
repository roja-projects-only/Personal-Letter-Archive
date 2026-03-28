import { useCallback, useEffect, useState } from 'react'
import { recipientSession } from '../api/recipient'

export function useRecipientSession() {
  const [status, setStatus] = useState('loading')
  const [recipient, setRecipient] = useState(null)

  const refresh = useCallback(() => {
    setStatus('loading')
    return recipientSession()
      .then((res) => {
        setRecipient(res.data)
        setStatus('authed')
        return res.data
      })
      .catch(() => {
        setRecipient(null)
        setStatus('anon')
        return null
      })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    status,
    recipient,
    refresh,
    isLoading: status === 'loading',
    isAuthed: status === 'authed',
  }
}
