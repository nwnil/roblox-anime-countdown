export interface UploadResponse {
  url: string
  path: string
  bucket: string
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    // Get response text first
    const responseText = await response.text()
    
    if (!response.ok) {
      console.error('Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        responseText: responseText
      })

      try {
        const errorData = JSON.parse(responseText)
        throw new Error(errorData.error || `Upload failed: ${response.status} ${response.statusText}`)
      } catch (parseError) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}. Response: ${responseText}`)
      }
    }

    try {
      const result: UploadResponse = JSON.parse(responseText)
      console.log('Upload successful:', result)
      return result.url
    } catch (parseError) {
      console.error('Failed to parse success response:', responseText)
      throw new Error('Upload succeeded but response format was invalid')
    }

  } catch (error) {
    console.error('Upload error details:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Upload failed: Network or unknown error')
  }
}

export function getFileType(file: File): 'image' | 'video' | 'unknown' {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  return 'unknown'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function isValidFileType(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'))
    }
    return file.type === type
  })
} 