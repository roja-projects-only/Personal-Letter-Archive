import { api } from './client'

export function login(email, password) {
  return api.post('/api/auth/login', { email, password })
}

export function logout() {
  return api.post('/api/auth/logout')
}

export function me() {
  return api.get('/api/auth/me')
}
