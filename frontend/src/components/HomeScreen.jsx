import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { RedButton } from '../utils/ThemedButton';

export default function HomeScreen({
  name,
  setName,
  createRoom,
  joinRoom,
  joinCode,
  setJoinCode,
  error,
}) {
  return (
    <div className="bg-gray-900 min-h-screen overflow-hidden w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-white tracking-wide">
        MindMesh
      </h1>

      <div className="w-full max-w-sm space-y-5 flex flex-col items-center font-nunito">
        {/* Name Input */}
        <div className="w-max">
          <label htmlFor="name-input" className="flex items-center sm:text-lg mb-2 font-sans text-gray-200 ">
            <FaUserCircle className="mr-2 text-xl sm:text-2xl" />
            <span className='text-sm font-medium tracking-widest'>ENTER NAME </span>         
          </label>
          <input
            id="name-input"
            type="text"
            className="w-52 px-4 py-2 rounded-lg text-black font-bold bg-white backdrop-blur-md placeholder-slate-400 border border-black focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Create Room Button */}
        <RedButton onClick={createRoom}>CREATE ROOM</RedButton>

        {/* Join Code Input */}
        <input
          type="text"
          className="w-52 px-4 py-2 rounded-lg text-black font-bold bg-white backdrop-blur-md placeholder-slate-400 border border-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Room Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          autoComplete="off"
        />

        {/* Join Room Button */}
        <RedButton onClick={joinRoom}>JOIN ROOM</RedButton>

        {/* Error */}
        {error && (
          <div className="text-red-400 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
}