'use client';

import { FC, useEffect, useState } from 'react';

import { useDebounce } from '@/hooks';

type Props = {
  valueProps: string;
  setValueProps: (value: string) => void;
  id: string;
  placeholder: string;
};

const Input: FC<Props> = ({
  valueProps,
  setValueProps,
  id,
  placeholder,
}: Props) => {
  const [value, setValue] = useState<string>(valueProps);

  const debouncedValue = useDebounce<string>(value, 400);

  useEffect(() => {
    setValueProps(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      className="form-input block w-full rounded-md 
                border-0 py-1.5 text-gray-900 shadow-sm 
                ring-1 ring-inset ring-gray-300 
               placeholder:text-gray-400
                focus:ring-inset focus:ring-sky-600 
                sm:text-sm sm:leading-6 flex-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default Input;
