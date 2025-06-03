# File Upload Setup Guide

## Overview
This guide will help you set up drag-and-drop file upload functionality for images and videos in your Roblox Anime Countdown app. Users can now upload game thumbnails, icons, preview videos, and sneak peek images directly from their PC.

## Features Added
- 🖼️ **Drag & Drop Image Upload** - Thumbnails, icons, and sneak peek images
- 🎥 **Drag & Drop Video Upload** - Game trailers and preview videos  
- 🔄 **Dual Input Methods** - Upload files OR paste URLs
- 📱 **Mobile Friendly** - Click to upload on mobile devices
- 🎨 **Live Previews** - See images and videos before saving
- 📊 **File Validation** - Size limits and type checking
- 🗂️ **Multi-Image Support** - Upload multiple sneak peek images
- ⚡ **Fast Performance** - Optimized with Supabase Storage

## Prerequisites
Before setting up file uploads, ensure you have:
- ✅ Supabase project configured
- ✅ Environment variables set up
- ✅ Admin panel access working

## Setup Instructions

### Step 1: Configure Supabase Storage

1. **Go to your Supabase Dashboard**
   - Navigate to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Set up Storage Buckets**
   - Go to **Storage** in the left sidebar
   - You should see the SQL Editor option
   - Navigate to **SQL Editor**
   - Copy and paste the contents of `supabase/storage-setup.sql`
   - Click **Run** to execute

   This will create:
   - `images` bucket for thumbnails, icons, and screenshots
   - `videos` bucket for trailers and preview videos
   - Proper security policies for authenticated uploads

3. **Add Service Role Key**
   - Go to **Settings** → **API**
   - Copy your **service_role** key (not the anon key)
   - Add it to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 2: Verify File Upload Components

The following new components have been added:

- `components/ui/file-upload.tsx` - Base drag & drop component
- `components/ui/media-upload.tsx` - URL + Upload tabs for single media
- `components/ui/multi-image-upload.tsx` - Multiple image management
- `lib/upload-utils.ts` - Upload utility functions
- `app/api/upload/route.ts` - Server-side upload handler

### Step 3: Test the Upload Functionality

1. **Start your development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Access the Admin Panel**
   - Go to `/admin` in your browser
   - Log in with your admin credentials

3. **Test Image Uploads**
   - Click "Add New Game" or edit an existing game
   - Go to the **Media** tab
   - Try both methods:
     - **URL Tab**: Paste image URLs as before
     - **Upload Tab**: Drag & drop images or click to browse

4. **Test Video Uploads**
   - In the Video Preview section
   - Upload MP4, WebM, or QuickTime videos
   - Videos can be up to 100MB

## File Specifications

### Supported Image Formats
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)
- **GIF** (.gif)

### Supported Video Formats
- **MP4** (.mp4)
- **WebM** (.webm)
- **QuickTime** (.mov)
- **AVI** (.avi)

### File Size Limits
- **Images**: 20MB maximum
- **Videos**: 100MB maximum
- **Multiple Images**: Up to 8 images per game

### Recommended Dimensions
- **Thumbnail**: 16:9 aspect ratio (e.g., 1920x1080)
- **Icon**: 1:1 aspect ratio (e.g., 512x512)
- **Sneak Peeks**: Any aspect ratio, optimized for display

## How to Use (Admin Panel)

### Single Media Upload (Thumbnail, Icon, Video)
1. Go to the **Media** tab when adding/editing a game
2. Each media field has two tabs:
   - **URL**: Enter a web URL (traditional method)
   - **Upload**: Drag & drop or click to upload files

### Multiple Images (Sneak Peeks)
1. In the **Additional Images** section
2. Use either method:
   - **URL Tab**: Add image URLs one by one
   - **Upload Tab**: Drag & drop images directly
3. Remove images by hovering and clicking the red X
4. Reorder by removing and re-adding if needed

### File Upload Process
1. **Select/Drop File**: Choose your file
2. **Validation**: System checks file type and size
3. **Preview**: See immediate preview while uploading
4. **Upload**: File uploads to Supabase Storage
5. **Save**: URL automatically saved to your game data

## Troubleshooting

### Upload Errors
- **"File size too large"**: Reduce file size or use a compression tool
- **"File type not supported"**: Check supported formats above
- **"Upload failed"**: Check your internet connection and Supabase status

### Storage Issues
- **403 Forbidden**: Verify storage policies are set up correctly
- **Bucket not found**: Run the storage setup SQL script
- **Service role key**: Ensure the service role key is in your .env.local

### Environment Variables
Make sure your `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Performance Tips
- **Optimize Images**: Use tools like TinyPNG before uploading
- **Video Compression**: Use H.264 codec for best compatibility
- **Batch Uploads**: Upload multiple images at once in sneak peeks section

## Security Features

### File Validation
- Server-side file type checking
- File size limitations enforced
- Malicious file detection

### Storage Security
- Public read access for displaying content
- Authenticated write access only
- Automatic file naming prevents conflicts

### URL Safety
- All uploaded files get secure, unique URLs
- No direct file system access
- Supabase CDN for fast delivery

## Additional Notes

### Backwards Compatibility
- Existing URL-based media will continue to work
- Both URL and upload methods available simultaneously
- No data migration needed

### Mobile Support
- Touch-friendly upload areas
- Camera access on mobile devices
- Responsive design for all screen sizes

### Future Enhancements
- Automatic image optimization
- Video thumbnail generation
- Batch upload for multiple games
- Advanced image editing tools

## Support

If you encounter issues:

1. **Check the browser console** for error messages
2. **Verify Supabase Storage** setup in your dashboard
3. **Test with small files** first to isolate issues
4. **Check network connectivity** and file permissions

The new upload system maintains all existing functionality while adding powerful drag-and-drop capabilities for a better user experience. 