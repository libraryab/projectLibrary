import axios from 'axios'
import { tokenUtils } from '../utils/tokenUtils'

const API_BASE_URL = '/api/v1'

/**
 * Get all reservations
 * @returns {Promise<Array>} Array of reservation objects
 */
export const getAllReservations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reservations`)
    const reservations = response.data.data || response.data
    return Array.isArray(reservations) ? reservations : []
  } catch (error) {
    console.error('Error fetching reservations:', error)
    throw error
  }
}

/**
 * Get reservation by ID
 * @param {string} reservationId - The reservation ID
 * @returns {Promise<Object>} Reservation object
 */
export const getReservationById = async (reservationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reservations/${reservationId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error fetching reservation ${reservationId}:`, error)
    throw error
  }
}

/**
 * Create a new reservation
 * @param {Object} reservationData - { bookId, memberId }
 * @returns {Promise<Object>} Created reservation object
 */
export const createReservation = async (reservationData) => {
  try {
    const token = tokenUtils.getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    
    const response = await axios.post(
      `${API_BASE_URL}/reservations`,
      reservationData,
      { headers }
    )
    return response.data.data || response.data
  } catch (error) {
    console.error('Error creating reservation:', error)
    throw error
  }
}

/**
 * Cancel a reservation
 * @param {string} reservationId - The reservation ID
 * @returns {Promise<Object>} Updated reservation object
 */
export const cancelReservation = async (reservationId) => {
  try {
    const token = tokenUtils.getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    
    const response = await axios.delete(
      `${API_BASE_URL}/reservations/${reservationId}`,
      { headers }
    )
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error canceling reservation ${reservationId}:`, error)
    throw error
  }
}

/**
 * Count active reservations (not cancelled)
 * @returns {Promise<number>} Count of active reservations
 */
export const getActiveReservationsCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reservations`)
    const reservations = response.data.data || response.data
    if (!Array.isArray(reservations)) return 0
    return reservations.filter(res => res.isCancelled !== true).length
  } catch (error) {
    console.error('Error counting active reservations:', error)
    throw error
  }
}

/**
 * Get recent reservations (last N)
 * @param {number} limit - Number of recent items to return
 * @returns {Promise<Array>} Array of recent reservations
 */
export const getRecentReservations = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reservations`)
    const reservations = response.data.data || response.data
    if (!Array.isArray(reservations)) return []
    
    // Sort by creation date (newest first) and limit
    return reservations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching recent reservations:', error)
    throw error
  }
}
