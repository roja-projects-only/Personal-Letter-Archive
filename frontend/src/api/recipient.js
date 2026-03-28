import { api } from './client'

export function verifyRecipient(pin, name) {
  return api.post('/api/recipient/verify', { pin, name })
}

export function recipientSession() {
  return api.get('/api/recipient/session')
}

export function recipientLogout() {
  return api.post('/api/recipient/logout')
}
