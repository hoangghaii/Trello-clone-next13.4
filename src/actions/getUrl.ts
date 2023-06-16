import { storage } from '@/libs/appwrite';
import { Image } from '@/types';

export const getUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);

  return url;
};
