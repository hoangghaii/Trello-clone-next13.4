import Image from 'next/image';
import { FC } from 'react';

import Modal from '@/components/modals/Modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  image: string | null;
};

const ImageModal: FC<Props> = ({ isOpen, onClose, image }: Props) => {
  if (!image) {
    return;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-full ">
        <Image
          width={400}
          height={200}
          src={image}
          alt="Task Image"
          className="object-contain rounded-md my-0 mx-auto"
          priority
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
