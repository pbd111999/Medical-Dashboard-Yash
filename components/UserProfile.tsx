'use client'

import { useState } from 'react'
import Image from 'next/image'
import { userService } from '@/services/userService'

interface User {
  id: string
  fullName: string
  email: string
  gender: string
  phoneNumber: string
  profileImage?: string
}

interface UserProfileProps {
  user: User | null
  onUserUpdate: (user: User) => void
}

export default function UserProfile({ user, onUserUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    gender: user?.gender || '',
    phoneNumber: user?.phoneNumber || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const updatedUser = await userService.updateProfile({
        ...formData,
        profileImage
      })
      onUserUpdate(updatedUser)
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
    }
  }

  if (!user) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={user.profileImage || '/default-avatar.png'}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          {isEditing && (
            <div>
              <label htmlFor="profileImage" className="btn-secondary text-sm cursor-pointer">
                Change Photo
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Full Name (Read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={user.fullName}
            disabled
            className="input-field bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className={`input-field ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setFormData({
                  email: user.email,
                  gender: user.gender,
                  phoneNumber: user.phoneNumber
                })
                setError('')
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  )
}