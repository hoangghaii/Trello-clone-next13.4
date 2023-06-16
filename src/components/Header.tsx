'use client';

import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { FC } from 'react';
import Avatar from 'react-avatar';

import Input from '@/components/inputs/Input';
import { useBoardStore } from '@/hooks';

const Header: FC = () => {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055d1] rounded-md filter blur-3xl opacity-50 -z-50" />

        <Image
          src="https://links.papareact.com/c2cdd5"
          width={300}
          height={100}
          alt="Trello Logo"
          priority
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial w-6/12">
            <label htmlFor="search-input">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </label>
            <Input
              valueProps={searchString}
              setValueProps={setSearchString}
              id="search-input"
              placeholder="Search"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar name="hoang hai" size="50" round color="#0055d1" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center p-5 text-sm font-light shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055d1]">
          <UserCircleIcon className="inline-block h-10 w-10 text-[#0055d1] mr-1" />
          Occaecat non eiusmod labore ea laborum culpa.
        </p>
      </div>
    </header>
  );
};

export default Header;
