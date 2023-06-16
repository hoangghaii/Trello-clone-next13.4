import { storage } from '@/libs/appwrite';
import { Image } from '@/types';

export const getUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);

  return url;
};

export const getFile = async (image: Image) => {
  const url = await storage.getFile(image.bucketId, image.fileId);

  return url;
};
