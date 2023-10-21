import fs from 'fs';

import { createClient } from '@supabase/supabase-js';
import mime from 'mime';

import { getSupabaseUploadPath } from '../utils';

export const uploadImage = async (imagePath: string): Promise<void> => {
  const { SUPABASE_URL, SUPABASE_KEY, SUPABASE_STORAGE_BUCKET } = Bun.env;

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(
      getSupabaseUploadPath(imagePath),
      fs.readFileSync(imagePath),
      getImageOptions(imagePath)
    );

  if (error) throw new Error(`uploadCoverImage: ${JSON.stringify(error)}`);
  console.log(`uploadCoverImage: uploaded image '${imagePath}'`);
};

const getImageOptions = (coverImagePath: string): { cacheControl: string; contentType: string } => {
  return {
    cacheControl: '604800',
    contentType: mime.getType(coverImagePath) ?? 'image/jpg',
  };
};
