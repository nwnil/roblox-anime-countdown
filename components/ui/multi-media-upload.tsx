"use client"

import React, { useState, useCallback } from 'react'
import { FileUpload } from './file-upload'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Plus, 
  Star, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  GripVertical,
  Upload,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MultiMediaUploadProps {
  label?: string
  mediaUrls: string[]
  primaryVideoUrl?: string
  onChange: (urls: string[]) => void
  onPrimaryVideoChange?: (url: string) => void
  maxItems?: number
  className?: string
  disabled?: boolean
}

export function MultiMediaUpload({
  label = "Media Files",
  mediaUrls = [],
  primaryVideoUrl = "",
  onChange,
  onPrimaryVideoChange,
  maxItems = 20,
  className,
  disabled = false
}: MultiMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const isVideo = (url: string) => {
    return url.includes('video') || url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)
  }

  const getVideos = () => mediaUrls.filter(isVideo)
  const getImages = () => mediaUrls.filter(url => !isVideo(url))

  const handleFileUpload = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true)
    setUploadError(null)

    try {
      console.log('MultiMediaUpload: Starting upload for', file.name)
      
      // Small delay to ensure everything is properly initialized
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Upload failed: ${response.status} ${errorData}`)
      }

      const data = await response.json()
      
      if (!data.success || !data.url) {
        throw new Error(data.error || 'Upload failed - no URL returned')
      }

      const newUrls = [...mediaUrls, data.url]
      onChange(newUrls)

      // Auto-set as primary video if it's the first video
      if (isVideo(data.url) && !primaryVideoUrl) {
        onPrimaryVideoChange?.(data.url)
      }

      console.log('MultiMediaUpload: Upload successful', data.url)
      return data.url

    } catch (error) {
      console.error('MultiMediaUpload: Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(errorMessage)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [mediaUrls, onChange, onPrimaryVideoChange, primaryVideoUrl])

  const handleRemove = useCallback((index: number) => {
    const urlToRemove = mediaUrls[index]
    const newUrls = mediaUrls.filter((_, i) => i !== index)
    onChange(newUrls)

    // If removed video was primary, set new primary
    if (urlToRemove === primaryVideoUrl) {
      const remainingVideos = newUrls.filter(isVideo)
      onPrimaryVideoChange?.(remainingVideos[0] || "")
    }
  }, [mediaUrls, onChange, primaryVideoUrl, onPrimaryVideoChange])

  const handleSetPrimary = useCallback((url: string) => {
    if (isVideo(url)) {
      onPrimaryVideoChange?.(url)
    }
  }, [onPrimaryVideoChange])

  // Drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newUrls = [...mediaUrls]
    const draggedItem = newUrls[draggedIndex]
    newUrls.splice(draggedIndex, 1)
    newUrls.splice(dropIndex, 0, draggedItem)
    
    onChange(newUrls)
    setDraggedIndex(null)
  }

  const canAddMore = mediaUrls.length < maxItems

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      {label && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{mediaUrls.length} / {maxItems}</span>
            {getVideos().length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getVideos().length} videos
              </Badge>
            )}
            {getImages().length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getImages().length} images
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Upload Error</p>
            <p className="text-red-300 text-sm mt-1">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Media Grid */}
      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={cn(
                "relative group rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-move",
                draggedIndex === index 
                  ? "border-blue-400 scale-105 opacity-50" 
                  : "border-gray-700 hover:border-gray-600",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Media Preview */}
              <div className="aspect-video bg-gray-900 relative">
                {isVideo(url) ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col">
                  {/* Top controls */}
                  <div className="flex justify-between p-2">
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-4 w-4 text-white/70" />
                      <span className="text-white/70 text-xs">#{index + 1}</span>
                    </div>
                    <button
                      onClick={() => handleRemove(index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                      disabled={disabled}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Center controls */}
                  <div className="flex-1 flex items-center justify-center">
                    {isVideo(url) && (
                      <button
                        onClick={() => handleSetPrimary(url)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all",
                          url === primaryVideoUrl
                            ? "bg-yellow-500 text-black"
                            : "bg-white/20 text-white hover:bg-yellow-500/80 hover:text-black"
                        )}
                        disabled={disabled}
                      >
                        <Star className={cn(
                          "h-3 w-3",
                          url === primaryVideoUrl ? "fill-current" : ""
                        )} />
                        {url === primaryVideoUrl ? "PRIMARY" : "Set Primary"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Type indicator */}
                <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  {isVideo(url) ? (
                    <>
                      <Video className="h-3 w-3" />
                      Video
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-3 w-3" />
                      Image
                    </>
                  )}
                </div>

                {/* Primary indicator */}
                {url === primaryVideoUrl && (
                  <div className="absolute bottom-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    PRIMARY
                  </div>
                )}

                {/* Upload success indicator */}
                {!isUploading && (
                  <div className="absolute bottom-2 left-2 bg-green-500/80 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Section */}
      {canAddMore && (
        <div className="space-y-4">
          <FileUpload
            onFileUpload={handleFileUpload}
            acceptedTypes={['image/*', 'video/*']}
            maxSize={100}
            placeholder={
              mediaUrls.length === 0 
                ? "Upload your first media file" 
                : "Add another file"
            }
            disabled={disabled || isUploading}
          />

          {/* Quick stats */}
          <div className="flex justify-center">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-4 text-sm text-gray-400">
              <span>Capacity: {mediaUrls.length}/{maxItems}</span>
              <span>•</span>
              <span>Images: {getImages().length}</span>
              <span>•</span>
              <span>Videos: {getVideos().length}</span>
              {primaryVideoUrl && (
                <>
                  <span>•</span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Primary set
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <p className="font-medium text-gray-300 mb-1">Images</p>
            <ul className="space-y-1 text-xs">
              <li>• JPG, PNG, WebP formats</li>
              <li>• Max size: 20MB each</li>
              <li>• Recommended: 1920x1080px</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-1">Videos</p>
            <ul className="space-y-1 text-xs">
              <li>• MP4, WebM, MOV, AVI, MKV</li>
              <li>• Max size: 100MB each</li>
              <li>• Click ⭐ to set primary video</li>
            </ul>
          </div>
        </div>
      </div>

      {/* No media state */}
      {mediaUrls.length === 0 && !isUploading && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No media uploaded yet</p>
          <p className="text-sm">Upload images and videos to showcase your game</p>
        </div>
      )}
    </div>
  )
} 