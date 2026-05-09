// Token management utilities
const TOKEN_KEY = 'authToken'

export const tokenUtils = {
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY)
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY)
  },

  hasToken: () => {
    return !!localStorage.getItem(TOKEN_KEY)
  }
}
