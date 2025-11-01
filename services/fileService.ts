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

export interface UploadFileData {
  file: File
  fileType: string
  fileName: string
}

export const fileService = {
  async uploadFile(data: UploadFileData) {
    try {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('fileType', data.fileType)
      formData.append('fileName', data.fileName)

      const response = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload file')
    }
  },

  async getFiles() {
    try {
      const response = await api.get('/api/files')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch files')
    }
  },

  async deleteFile(fileId: string) {
    try {
      await api.delete(`/api/files/${fileId}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete file')
    }
  }
}