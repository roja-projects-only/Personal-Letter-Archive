import { api } from './client'

export function listLetters() {
  return api.get('/api/letters')
}

export function getLetter(id) {
  return api.get(`/api/letters/${id}`)
}

export function createLetter(payload) {
  return api.post('/api/letters', payload)
}

export function updateLetter(id, payload) {
  return api.put(`/api/letters/${id}`, payload)
}

export function deleteLetter(id) {
  return api.delete(`/api/letters/${id}`)
}

export function postReply(letterId, content) {
  return api.post(`/api/letters/${letterId}/replies`, { content })
}

export function listReplies(letterId) {
  return api.get(`/api/letters/${letterId}/replies`)
}
