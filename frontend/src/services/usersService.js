import apiClient from './authService'

const unwrapDataArray = (response) => {
  const payload = response?.data?.data ?? response?.data ?? []
  return Array.isArray(payload) ? payload : []
}

export const getUsers = async (search = '') => {
  const response = await apiClient.get(`/users${search ? `?search=${encodeURIComponent(search)}` : ''}`)
  return unwrapDataArray(response)
}

export const updateUserRole = async (userId, payload) => {
  const response = await apiClient.patch(`/users/${userId}/role`, payload)
  return response?.data?.data ?? response?.data ?? null
}

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`)
  return response?.data?.data ?? response?.data ?? null
}