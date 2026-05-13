import axios from 'axios'
import { tokenUtils } from '../utils/tokenUtils'

const API_BASE_URL = '/api/v1'

/**
 * Get all loans
 * @returns {Promise<Array>} Array of loan objects
 */
export const getAllLoans = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/loans`)
    const loans = response.data?.value || response.data?.data || response.data
    return Array.isArray(loans) ? loans : []
  } catch (error) {
    console.error('Error fetching loans:', error)
    throw error
  }
}

/**
 * Get loan by ID
 * @param {string} loanId - The loan ID
 * @returns {Promise<Object>} Loan object
 */
export const getLoanById = async (loanId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/loans/${loanId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error fetching loan ${loanId}:`, error)
    throw error
  }
}

/**
 * Get active loans (not returned)
 * @returns {Promise<Array>} Array of active loans
 */
export const getActiveLoans = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/loans`)
    const loans = response.data?.value || response.data?.data || response.data
    if (!Array.isArray(loans)) return []
    return loans.filter(loan => loan.returnedDate === null)
  } catch (error) {
    console.error('Error fetching active loans:', error)
    throw error
  }
}

/**
 * Count active loans
 * @returns {Promise<number>} Count of active loans
 */
export const getActiveLoansCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/loans`)
    const loans = response.data?.value || response.data?.data || response.data
    if (!Array.isArray(loans)) return 0
    return loans.filter(loan => loan.returnedDate === null).length
  } catch (error) {
    console.error('Error counting active loans:', error)
    throw error
  }
}

/**
 * Mark a loan as returned
 * @param {string} loanId - The loan ID
 * @returns {Promise<Object>} Updated loan object
 */
export const returnLoan = async (loanId) => {
  try {
    const token = tokenUtils.getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    
    const response = await axios.patch(
      `${API_BASE_URL}/loans/${loanId}/return`,
      {},
      { headers }
    )
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error returning loan ${loanId}:`, error)
    throw error
  }
}

/**
 * Get member's loans
 * @param {string} memberId - The member ID
 * @returns {Promise<Object>} Object with member and loans array
 */
export const getMemberLoans = async (memberId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/loans/member/${memberId}`)
    return response.data?.data || response.data
  } catch (error) {
    console.error(`Error fetching member loans for ${memberId}:`, error)
    throw error
  }
}

/**
 * Check if a loan is overdue
 * @param {string} dueDate - Due date string
 * @returns {boolean} True if overdue
 */
export const isLoanOverdue = (dueDate) => {
  const due = new Date(dueDate)
  const today = new Date()
  return due < today
}

/**
 * Calculate days until due or overdue days
 * @param {string} dueDate - Due date string
 * @returns {Object} { daysRemaining, isOverdue }
 */
export const getDueInfo = (dueDate) => {
  const due = new Date(dueDate)
  const today = new Date()
  const diffTime = due - today
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return {
    daysRemaining,
    isOverdue: daysRemaining < 0
  }
}

/**
 * Create a new loan
 * @param {Object} loanData - { bookId, memberId }
 * @returns {Promise<Object>} Created loan object
 */
export const createLoan = async (loanData) => {
  try {
    const token = tokenUtils.getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    
    const response = await axios.post(`${API_BASE_URL}/loans`, loanData, { headers })
    return response.data.data || response.data
  } catch (error) {
    console.error('Error creating loan:', error)
    throw error
  }
}
