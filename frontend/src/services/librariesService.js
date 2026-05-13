import axios from 'axios'
import { tokenUtils } from '../utils/tokenUtils'

const API_BASE_URL = '/api/v1'

export const getAllLibraries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/libraries`)
    return response.data.data || response.data || []
  } catch (error) {
    console.error('Error fetching libraries:', error)
    throw error
  }
}

export const getLibraryById = async (libraryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/libraries/${libraryId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error fetching library ${libraryId}:`, error)
    throw error
  }
}

export const createLibrary = async (libraryData) => {
  try {
    const token = tokenUtils.getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await axios.post(`${API_BASE_URL}/libraries`, libraryData, { headers })
    return response.data.data || response.data
  } catch (error) {
    console.error('Error creating library:', error)
    throw error
  }
}
