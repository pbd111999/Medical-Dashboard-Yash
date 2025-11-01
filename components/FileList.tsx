'use client'

import { useState, useEffect } from 'react'
import { fileService } from '@/services/fileService'
import FilePreviewModal from './FilePreviewModal'

interface MedicalFile {
  id: string
  fileName: string
  fileType: string
  filePath: string
  uploadDate: string
  fileSize: number
}

export default function FileList() {
  const [files, setFiles] = useState<MedicalFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<MedicalFile | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const filesData = await fileService.getFiles()
      setFiles(filesData)
    } catch (err: any) {
      setError(err.message || 'Failed to load files')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return
    }

    try {
      await fileService.deleteFile(fileId)
      setFiles(prev => prev.filter(file => file.id !== fileId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete file')
    }
  }

  const handleView = (file: MedicalFile) => {
    setSelectedFile(file)
    setShowPreview(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType: string) => {
    const icons: { [key: string]: string } = {
      'Lab Report': '🧪',
      'Prescription': '💊',
      'X-Ray': '🦴',
      'Blood Report': '🩸',
      'MRI Scan': '🧠',
      'CT Scan': '📷'
    }
    return icons[fileType] || '📄'
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Uploaded Files</h2>
          <span className="text-sm text-gray-500">{files.length} files</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {files.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload your first medical file to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map(file => (
              <div
                key={file.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getFileIcon(file.fileType)}</div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{file.fileName}</h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>{file.fileType}</span>
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span>{formatDate(file.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(file)}
                      className="btn-primary text-sm py-1 px-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPreview && selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => {
            setShowPreview(false)
            setSelectedFile(null)
          }}
        />
      )}
    </>
  )
}