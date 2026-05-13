import axios from 'axios'

const API_BASE_URL = '/api/v1'

/**
 * Get all members
 * @returns {Promise<Array>} Array of member objects
 */
export const getAllMembers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/members`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching members:', error)
    throw error
  }
}

/**
 * Get member by ID
 * @param {string} memberId - The member ID
 * @returns {Promise<Object>} Member object
 */
export const getMemberById = async (memberId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/members/${memberId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error fetching member ${memberId}:`, error)
    throw error
  }
}

/**
 * Count total members
 * @returns {Promise<number>} Total number of members
 */
export const getTotalMembersCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/members`)
    const members = response.data.data || response.data
    return members.length
  } catch (error) {
    console.error('Error counting members:', error)
    throw error
  }
}
