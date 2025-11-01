'use client'

import { useState } from 'react'
import { fileService } from '@/services/fileService'

interface FileUploadProps {
  onFileUploaded: () => void
}

const FILE_TYPES = [
  'Lab Report',
  'Prescription',
  'X-Ray',
  'Blood Report',
  'MRI Scan',
  'CT Scan'
]

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [formData, setFormData] = useState({
    fileType: '',
    fileName: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    if (!formData.fileType || !formData.fileName) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      await fileService.uploadFile({
        file: selectedFile,
        fileType: formData.fileType,
        fileName: formData.fileName
      })
      
      // Reset form
      setFormData({ fileType: '', fileName: '' })
      setSelectedFile(null)
      onFileUploaded()
    } catch (err: any) {
      setError(err.message || 'Failed to upload file')
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF and image files are allowed')
        return
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      
      setSelectedFile(file)
      setError('')
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Medical File</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Type */}
        <div>
          <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
            File Type *
          </label>
          <select
            id="fileType"
            name="fileType"
            required
            value={formData.fileType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select File Type</option>
            {FILE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* File Name */}
        <div>
          <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
            File Name *
          </label>
          <input
            id="fileName"
            name="fileName"
            type="text"
            required
            value={formData.fileName}
            onChange={handleChange}
            placeholder="e.g., Ankit's Lab Report for Typhoid"
            className="input-field"
          />
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Select File *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
              {selectedFile && (
                <p className="text-sm text-green-600 font-medium">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Uploading...' : 'Submit File'}
          </button>
        </div>
      </form>
    </div>
  )
}