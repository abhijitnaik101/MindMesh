import React from 'react';
import { FaUsersSlash } from 'react-icons/fa';
import { GreenButton } from '../utils/ThemedButton';

export default function NoMajorityScreen({ message, proceed }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 px-4 text-white font-sans space-y-8">
      
      {/* Icon and Title */}
      <div className="flex items-center gap-3 text-4xl sm:text-5xl font-extrabold ">
        <FaUsersSlash />
        No Majority!
      </div>

      {/* Message */}
      <p className="text-lg sm:text-xl text-gray-300 max-w-md">
        {message}
      </p>

      {/* Continue Button */}
      <GreenButton onClick={proceed}>Continue →</GreenButton>
    </div>
  );
}
