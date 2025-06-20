import React from 'react';
import { FaUserTimes } from 'react-icons/fa';
import { GreenButton } from '../utils/ThemedButton';

export default function PlayerKickedScreen({ kickedName, isSpy, proceed }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 px-4 text-white font-sans space-y-8">
      
      {/* Icon and Title */}
      <div className="flex items-center gap-3 text-3xl sm:text-3xl font-extrabold">
        <FaUserTimes />
        Player Kicked
      </div>

      {/* Player name */}
      <p className="text-xl sm:text-xl text-white">
        <span className='px-2 bg-white rounded-full text-black max-w-10 truncate'>{kickedName}</span> was kicked!
      </p>

      {/* Outcome message */}
      <p className="text-lg sm:text-xl text-red-400 max-w-md">
        {isSpy ? "The spy has been caught!" : "Citizens made the wrong choice!"}
      </p>

      {/* Continue Button */}
      <GreenButton onClick={proceed}>Next Round →</GreenButton>
    </div>
  );
}
