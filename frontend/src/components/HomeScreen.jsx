import React, { useState } from 'react';
import { FaQuestionCircle, FaUserCircle } from 'react-icons/fa';
import { RedButton } from '../utils/ThemedButton';
import { FaTimes } from 'react-icons/fa';
import TutorialModal from './TutorialModal';

export default function HomeScreen({
  name,
  setName,
  createRoom,
  joinRoom,
  joinCode,
  setJoinCode,
  error,
}) {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="bg-gray-900 min-h-screen overflow-hidden w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">

      {/* Tutorial Button */}
      <button
        className="flex justify-center items-center absolute top-4 right-4 px-3 py-1 rounded-md text-sm bg-white text-gray-800 font-semibold shadow hover:bg-gray-100 transition"
        onClick={() => setShowTutorial(true)}
      >
        <FaQuestionCircle/>
        <span className='px-2'>Help</span>
      </button>

      {/* Error */}
      {error && <div className="mb-6 text-red-400 font-semibold text-sm text-center">{error}</div>}

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-white tracking-wide">
        MindMesh
      </h1>

      <div className="w-full max-w-sm space-y-5 flex flex-col items-center font-nunito">
        {/* Name Input */}
        <div className="w-max">
          <label htmlFor="name-input" className="flex items-center sm:text-lg mb-2 font-sans text-gray-200">
            <FaUserCircle className="mr-2 text-xl sm:text-2xl" />
            <span className='text-sm font-medium tracking-widest'>ENTER NAME</span>
          </label>
          <input
            id="name-input"
            type="text"
            className="w-52 px-4 py-2 rounded-lg text-black font-bold bg-white placeholder-slate-400 border border-black focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Create Room */}
        <RedButton onClick={createRoom}>CREATE ROOM</RedButton>

        {/* Join Code */}
        <input
          type="text"
          className="w-52 px-4 py-2 rounded-lg text-black font-bold bg-white placeholder-slate-400 border border-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Room Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          autoComplete="off"
        />

        {/* Join Room */}
        <RedButton onClick={joinRoom}>JOIN ROOM</RedButton>

        
      </div>
      {/* Tutorial Modal */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </div>
  );
}
