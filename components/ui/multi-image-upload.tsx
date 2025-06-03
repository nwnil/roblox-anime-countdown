"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileUpload } from '@/components/ui/file-upload'
import { uploadFile } from '@/lib/upload-utils'
import { Link, Upload, Plus, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface MultiImageUploadProps {
  label: string
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  className?: string
  disabled?: boolean
}

export function MultiImageUpload({
  label,
  images,
  onChange,
  maxImages = 10,
  className,
  disabled = false
}: MultiImageUploadProps) {
  const [urlInput, setUrlInput] = useState('')
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url')

  const addImageFromUrl = () => {
    if (urlInput && !images.includes(urlInput) && images.length < maxImages) {
      onChange([...images, urlInput])
      setUrlInput('')
    }
  }

  const removeImage = (imageToRemove: string) => {
    onChange(images.filter(image => image !== imageToRemove))
  }

  const handleFileUpload = async (file: File): Promise<string> => {
    if (images.length >= maxImages) {
      throw new Error(`Maximum ${maxImages} images allowed`)
    }

    try {
      const uploadedUrl = await uploadFile(file)
      onChange([...images, uploadedUrl])
      return uploadedUrl
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  const handleUrlInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addImageFromUrl()
    }
  }

  return (
    <div className={className}>
      <Label className="text-white mb-3 block">{label}</Label>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'url' | 'upload')}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger 
            value="url" 
            className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            disabled={disabled}
          >
            <Link className="h-4 w-4" />
            URL
          </TabsTrigger>
          <TabsTrigger 
            value="upload" 
            className="flex items-center gap-2 data-[state=active]:bg-gray-700"
            disabled={disabled}
          >
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={handleUrlInputKeyPress}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter image URL"
                disabled={disabled || images.length >= maxImages}
              />
              <Button 
                type="button" 
                onClick={addImageFromUrl}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={disabled || !urlInput.trim() || images.length >= maxImages}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {images.length >= maxImages && (
              <p className="text-amber-400 text-sm">
                Maximum {maxImages} images reached
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <div className="space-y-3">
            {images.length < maxImages ? (
              <FileUpload
                onFileUpload={handleFileUpload}
                acceptedTypes={['image/*']}
                maxSize={20}
                placeholder="Drop image here or click to upload"
                disabled={disabled}
              />
            ) : (
              <div className="aspect-video rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50 flex flex-col items-center justify-center p-8">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-white mb-2">
                  Maximum images reached
                </p>
                <p className="text-sm text-gray-400">
                  Remove some images to upload more
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  
                  {/* Remove button overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Image index badge */}
                <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          {/* Image count */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {images.length} of {maxImages} images
            </span>
            {images.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange([])}
                className="text-red-400 border-red-400 hover:bg-red-400/10"
                disabled={disabled}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 