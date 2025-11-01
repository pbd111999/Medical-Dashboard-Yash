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

export interface UpdateProfileData {
  email: string
  gender: string
  phoneNumber: string
  profileImage?: File | null
}

export const userService = {
  async updateProfile(data: UpdateProfileData) {
    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('gender', data.gender)
      formData.append('phoneNumber', data.phoneNumber)
      
      if (data.profileImage) {
        formData.append('profileImage', data.profileImage)
      }

      const response = await api.put('/api/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  }
}