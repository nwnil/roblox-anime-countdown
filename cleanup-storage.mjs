import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanupOrphanedFiles() {
  console.log('🧹 Starting storage cleanup...');
  
  try {
    // Get all files from storage
    const { data: imagesData, error: imagesError } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });
      
    const { data: videosData, error: videosError } = await supabase.storage
      .from('videos')
      .list('', { limit: 1000 });
    
    if (imagesError || videosError) {
      console.error('Error listing files:', imagesError || videosError);
      return;
    }
    
    // Get all games from database
    const { data: gamesData, error: gamesError } = await supabase
      .from('games')
      .select('id, title, icon_url, image_url, trailer_url, media_urls');
      
    if (gamesError) {
      console.error('Error fetching games:', gamesError);
      return;
    }
    
    console.log(`📊 Found ${imagesData.length} images and ${videosData.length} videos in storage`);
    console.log(`📊 Found ${gamesData.length} games in database`);
    
    // Collect all file URLs that should exist
    const validFileUrls = new Set();
    
    gamesData.forEach(game => {
      if (game.icon_url) {
        const fileName = game.icon_url.split('/').pop();
        validFileUrls.add(fileName);
      }
      if (game.image_url) {
        const fileName = game.image_url.split('/').pop();
        validFileUrls.add(fileName);
      }
      if (game.trailer_url) {
        const fileName = game.trailer_url.split('/').pop();
        validFileUrls.add(fileName);
      }
      if (game.media_urls && Array.isArray(game.media_urls)) {
        game.media_urls.forEach(url => {
          const fileName = url.split('/').pop();
          validFileUrls.add(fileName);
        });
      }
    });
    
    console.log(`📝 Valid files that should exist: ${validFileUrls.size}`);
    
    // Find orphaned files
    const orphanedImages = imagesData.filter(file => !validFileUrls.has(file.name));
    const orphanedVideos = videosData.filter(file => !validFileUrls.has(file.name));
    
    console.log(`🗑️ Orphaned images: ${orphanedImages.length}`);
    console.log(`🗑️ Orphaned videos: ${orphanedVideos.length}`);
    
    if (orphanedImages.length > 0) {
      console.log('Orphaned images:');
      orphanedImages.forEach(file => console.log(`- ${file.name}`));
    }
    
    if (orphanedVideos.length > 0) {
      console.log('Orphaned videos:');
      orphanedVideos.forEach(file => console.log(`- ${file.name}`));
    }
    
    // Ask user if they want to delete orphaned files
    if (orphanedImages.length > 0 || orphanedVideos.length > 0) {
      console.log('\n⚠️  WARNING: This will permanently delete orphaned files!');
      console.log('🛑 Review the list above before proceeding.');
      console.log('💡 To delete these files, uncomment the deletion code below and run again.');
      
      // DELETE ORPHANED FILES - UNCOMMENT TO ENABLE
      
      // Delete orphaned images
      if (orphanedImages.length > 0) {
        const imageFilesToDelete = orphanedImages.map(file => file.name);
        const { error: deleteImagesError } = await supabase.storage
          .from('images')
          .remove(imageFilesToDelete);
          
        if (deleteImagesError) {
          console.error('Error deleting images:', deleteImagesError);
        } else {
          console.log(`✅ Deleted ${imageFilesToDelete.length} orphaned images`);
        }
      }
      
      // Delete orphaned videos
      if (orphanedVideos.length > 0) {
        const videoFilesToDelete = orphanedVideos.map(file => file.name);
        const { error: deleteVideosError } = await supabase.storage
          .from('videos')
          .remove(videoFilesToDelete);
          
        if (deleteVideosError) {
          console.error('Error deleting videos:', deleteVideosError);
        } else {
          console.log(`✅ Deleted ${videoFilesToDelete.length} orphaned videos`);
        }
      }
      
    } else {
      console.log('✅ No orphaned files found! Storage is clean.');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupOrphanedFiles(); 