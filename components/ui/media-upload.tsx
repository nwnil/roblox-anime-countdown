"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { uploadFile } from '@/lib/upload-utils'
import { Link, Upload } from 'lucide-react'

interface MediaUploadProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  acceptedTypes?: string[]
  maxSize?: number
  className?: string
  disabled?: boolean
}

export function MediaUpload({
  label,
  value,
  onChange,
  placeholder = "Enter URL or upload file",
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 50,
  className,
  disabled = false
}: MediaUploadProps) {
  const [urlInput, setUrlInput] = useState(value)
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url')

  const handleUrlSubmit = () => {
    onChange(urlInput)
  }

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      const uploadedUrl = await uploadFile(file)
      onChange(uploadedUrl)
      return uploadedUrl
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  const handleUrlInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit()
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
                placeholder={placeholder}
                disabled={disabled}
              />
              <Button 
                type="button" 
                onClick={handleUrlSubmit}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={disabled || !urlInput.trim()}
              >
                Set
              </Button>
            </div>
            
            {value && (
              <div className="mt-3">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                  {value.includes('video') || value.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? (
                    <video
                      src={value}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={value}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <FileUpload
            onFileUpload={handleFileUpload}
            acceptedTypes={acceptedTypes}
            maxSize={maxSize}
            currentUrl={value}
            placeholder="Drop files here or click to upload"
            disabled={disabled}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 