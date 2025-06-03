import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function manualCleanup() {
  console.log('🧹 Manual storage cleanup...');
  console.log('⚠️  This will delete ALL files from storage!');
  
  try {
    // Get all files from images bucket
    const { data: imagesData, error: imagesError } = await supabase.storage
      .from('images')
      .list('', { limit: 1000 });
      
    if (imagesError) {
      console.error('Error listing images:', imagesError);
    } else {
      console.log(`Found ${imagesData.length} images`);
      if (imagesData.length > 0) {
        const fileNames = imagesData.map(file => file.name);
        console.log('Images:', fileNames);
        
        // Delete all images
        const { error: deleteError } = await supabase.storage
          .from('images')
          .remove(fileNames);
          
        if (deleteError) {
          console.error('Error deleting images:', deleteError);
        } else {
          console.log(`✅ Deleted ${fileNames.length} images`);
        }
      }
    }
    
    // Get all files from videos bucket
    const { data: videosData, error: videosError } = await supabase.storage
      .from('videos')
      .list('', { limit: 1000 });
      
    if (videosError) {
      console.error('Error listing videos:', videosError);
    } else {
      console.log(`Found ${videosData.length} videos`);
      if (videosData.length > 0) {
        const fileNames = videosData.map(file => file.name);
        console.log('Videos:', fileNames);
        
        // Delete all videos
        const { error: deleteError } = await supabase.storage
          .from('videos')
          .remove(fileNames);
          
        if (deleteError) {
          console.error('Error deleting videos:', deleteError);
        } else {
          console.log(`✅ Deleted ${fileNames.length} videos`);
        }
      }
    }
    
    console.log('✅ Manual cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during manual cleanup:', error);
  }
}

manualCleanup(); 