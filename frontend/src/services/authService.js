import axios from 'axios'
import { tokenUtils } from '../utils/tokenUtils'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to request headers
apiClient.interceptors.request.use((config) => {
  const token = tokenUtils.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenUtils.removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password })
    if (response.data.token) {
      tokenUtils.setToken(response.data.token)
    }
    return response.data
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    if (response.data.token) {
      tokenUtils.setToken(response.data.token)
    }
    return response.data
  },

  logout: () => {
    tokenUtils.removeToken()
  }
}

export default apiClient
