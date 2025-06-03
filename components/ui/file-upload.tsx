"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, FileImage, FileVideo, Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<string>
  acceptedTypes: string[]
  maxSize?: number // in MB
  currentUrl?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onFileUpload,
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 50,
  currentUrl,
  placeholder = "Drop files here or click to upload",
  className,
  disabled = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const isValid = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'))
      }
      return file.type === type
    })

    if (!isValid) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
    }

    return null
  }, [acceptedTypes, maxSize])

  const simulateProgress = useCallback(() => {
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 200)
    return interval
  }, [])

  const handleFile = useCallback(async (file: File, retry = false) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsUploading(true)
    setUploadProgress(0)
    setUploadSuccess(false)

    // Start progress simulation
    const progressInterval = simulateProgress()

    try {
      // Create preview immediately
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type, retry ? `(Retry ${retryCount + 1})` : '(First attempt)')
      
      // Upload file with retry logic
      const uploadedUrl = await onFileUpload(file)
      
      // Complete progress
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Show success
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)
      
      console.log('Upload completed successfully, URL:', uploadedUrl)
      
      // Clean up preview URL and set final URL
      URL.revokeObjectURL(previewUrl)
      setPreview(uploadedUrl)
      setRetryCount(0)
      
    } catch (err) {
      clearInterval(progressInterval)
      console.error('Upload error in handleFile:', err)
      
      let errorMessage = 'Upload failed'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      // Enhanced retry logic - be more aggressive on first few attempts
      const shouldRetry = retryCount < 3 && (
        errorMessage.includes('network') || 
        errorMessage.includes('fetch') ||
        errorMessage.includes('Failed to upload') ||
        errorMessage.includes('bucket') ||
        retryCount === 0  // Always retry the first failure
      )
      
      if (shouldRetry) {
        console.log(`Upload failed, retrying in ${(retryCount + 1)}s... (${retryCount + 1}/3)`)
        setRetryCount(prev => prev + 1)
        setTimeout(() => handleFile(file, true), 1000 * (retryCount + 1))
        return
      }
      
      setError(errorMessage)
      setPreview(null)
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }, [onFileUpload, validateFile, retryCount, simulateProgress])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [disabled, handleFile])

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleRemove = useCallback(() => {
    setPreview(null)
    setError(null)
    setUploadProgress(0)
    setUploadSuccess(false)
    setRetryCount(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleRetry = useCallback(() => {
    if (fileInputRef.current?.files?.[0]) {
      handleFile(fileInputRef.current.files[0])
    }
  }, [handleFile])

  const getFileIcon = (url: string) => {
    if (url.includes('video') || url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
      return <FileVideo className="h-6 w-6 text-purple-400" />
    }
    return <FileImage className="h-6 w-6 text-blue-400" />
  }

  const isVideo = (url: string) => {
    return url.includes('video') || url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="relative group">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
            {isVideo(preview) ? (
              <video
                src={preview}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
            ) : (
              <img
                src={preview}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Success indicator */}
            {uploadSuccess && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="bg-green-500 text-white p-3 rounded-full">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-xs w-full mx-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="text-white font-medium">
                      {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Uploading...'}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-300 text-center">
                    {Math.round(uploadProgress)}%
                  </div>
                </div>
              </div>
            )}

            {/* Hover controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex gap-2">
                {error && (
                  <button
                    onClick={handleRetry}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                    disabled={disabled || isUploading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={handleRemove}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* File type indicator */}
            <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              {getFileIcon(preview)}
              {isVideo(preview) ? 'Video' : 'Image'}
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative aspect-video rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
            "flex flex-col items-center justify-center gap-4 p-8 min-h-[200px]",
            isDragging
              ? "border-blue-400 bg-blue-400/10 scale-105"
              : "border-gray-600 bg-gray-900/30 hover:border-gray-500 hover:bg-gray-900/50",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-white mb-2">
                {placeholder}
              </p>
              <p className="text-sm text-gray-400 mb-1">
                Supports: {acceptedTypes.map(type => type.split('/')[1]).join(', ')} 
              </p>
              <p className="text-xs text-gray-500">
                Max size: {maxSize}MB
              </p>
            </div>
          </div>

          {isDragging && (
            <div className="absolute inset-0 bg-blue-400/20 rounded-xl border-2 border-blue-400 flex items-center justify-center">
              <span className="text-blue-400 font-medium text-lg">Drop file here</span>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Upload Failed</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
            {retryCount > 0 && (
              <p className="text-red-300/70 text-xs mt-1">
                Retried {retryCount} time(s)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 