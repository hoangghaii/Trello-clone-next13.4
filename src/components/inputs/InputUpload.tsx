import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { FC } from 'react';

import { useBoardStore } from '@/hooks';

const InputUpload: FC = () => {
  const [image, setImage] = useBoardStore((state) => [
    state.image,
    state.setImage,
  ]);

  return (
    <div className="flex items-center justify-center w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 shadow-sm h-20">
      {image && (
        <div className="relative h-full w-2/4 rounded-md">
          <Image
            className="object-cover filter hover:grayscale transition-all duration-150 cursor-not-allowed"
            fill
            src={URL.createObjectURL(image)}
            alt="Uploaded Image"
            onClick={() => setImage(null)}
          />
        </div>
      )}

      {!image && (
        <label htmlFor="input-upload" className="w-5/12 cursor-pointer">
          <PhotoIcon className="w-6 h-6 mr-2 inline-block" />
          Upload Image
        </label>
      )}

      <input
        id="input-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => setImage(e.target.files![0])}
      />
    </div>
  );
};

export default InputUpload;
