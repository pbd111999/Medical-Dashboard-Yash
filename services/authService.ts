import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export interface SignupData {
  fullName: string
  email: string
  gender: string
  phoneNumber: string
  password: string
}

export const authService = {
  async signup(data: SignupData) {
    try {
      const response = await api.post('/api/auth/signup', data)
      const { token, user } = response.data
      
      Cookies.set('auth_token', token, { expires: 7 }) // 7 days
      return user
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed')
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { token, user } = response.data
      
      Cookies.set('auth_token', token, { expires: 7 }) // 7 days
      return user
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user data')
    }
  },

  logout() {
    Cookies.remove('auth_token')
  }
}