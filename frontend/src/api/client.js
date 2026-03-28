import axios from 'axios'

const baseURL =
  import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (import.meta.env.DEV) {
      console.error(
        '[API]',
        err.config?.method?.toUpperCase(),
        `${err.config?.baseURL || ''}${err.config?.url || ''}`,
        err.response?.status,
        err.response?.data,
      )
    }

    if (!err.response) {
      err.userMessage =
        err.code === 'ERR_NETWORK' || err.message === 'Network Error'
          ? 'Could not reach the server. Check your connection.'
          : 'Request failed'
      return Promise.reject(err)
    }

    const status = err.response.status
    const bodyError = err.response.data?.error
    const msg =
      typeof bodyError === 'string' && bodyError
        ? bodyError
        : status === 401
          ? 'Session expired — please log in again'
          : status === 429
            ? 'Too many attempts. Please wait and try again.'
            : status >= 500
              ? 'Something went wrong on the server'
              : 'Request failed'

    err.userMessage = msg
    return Promise.reject(err)
  },
)
