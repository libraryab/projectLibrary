import apiClient from './authService'

export const getUsers = async (search = '') => {
  const response = await apiClient.get(`/users${search ? `?search=${encodeURIComponent(search)}` : ''}`)
  return response.data || []
}

export const updateUserRole = async (userId, payload) => {
  const response = await apiClient.patch(`/users/${userId}/role`, payload)
  return response.data
}

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`)
  return response.data
}