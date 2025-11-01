'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import UserProfile from '@/components/UserProfile'
import FileUpload from '@/components/FileUpload'
import FileList from '@/components/FileList'
import { authService } from '@/services/authService'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshFiles, setRefreshFiles] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('auth_token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      try {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    authService.logout()
    router.push('/auth/login')
  }

  const handleFileUploaded = () => {
    setRefreshFiles(prev => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Medical Record Dashboard</h1>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - User Profile */}
          <div className="space-y-6">
            <UserProfile user={user} onUserUpdate={setUser} />
          </div>

          {/* Right Side - File Upload */}
          <div className="space-y-6">
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        </div>

        {/* Bottom Section - Uploaded Files */}
        <div className="mt-8">
          <FileList key={refreshFiles} />
        </div>
      </main>
    </div>
  )
}