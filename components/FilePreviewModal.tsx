'use client'

import { useEffect } from 'react'

interface MedicalFile {
  id: string
  fileName: string
  fileType: string
  filePath: string
  uploadDate: string
  fileSize: number
}

interface FilePreviewModalProps {
  file: MedicalFile
  onClose: () => void
}

export default function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getFileUrl = () => {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/files/download/${file.id}`
  }

  const isImage = (filePath: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext))
  }

  const isPdf = (filePath: string) => {
    return filePath.toLowerCase().endsWith('.pdf')
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{file.fileName}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {file.fileType} • {new Date(file.uploadDate).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isImage(file.filePath) ? (
            <div className="flex justify-center">
              <img
                src={getFileUrl()}
                alt={file.fileName}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : isPdf(file.filePath) ? (
            <div className="w-full h-96">
              <iframe
                src={getFileUrl()}
                className="w-full h-full border-0"
                title={file.fileName}
              />
            </div>
          ) : (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Preview not available</h3>
              <p className="mt-1 text-sm text-gray-500">
                This file type cannot be previewed in the browser.
              </p>
              <a
                href={getFileUrl()}
                download={file.fileName}
                className="btn-primary mt-4 inline-block"
              >
                Download File
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Press ESC to close
          </div>
          <div className="flex space-x-3">
            <a
              href={getFileUrl()}
              download={file.fileName}
              className="btn-secondary"
            >
              Download
            </a>
            <button
              onClick={() => window.open(getFileUrl(), '_blank')}
              className="btn-primary"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}