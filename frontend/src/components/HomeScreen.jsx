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
    <div className="bg-[url('/bg1.png')] bg-cover bg-center bg-no-repeat min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 font-nunito">
      {/* Title */}
      <h1 className="galada-regular text-4xl sm:text-5xl font-extrabold mb-10 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-wide text-center">
        MindMesh
      </h1>

      <div className="w-full max-w-sm space-y-5 flex flex-col items-center">
        {/* Name Input */}
        <div className="w-max">
          <label htmlFor="name-input" className="flex items-center text-base sm:text-lg text-violet-300 mb-2 font-bold">
            <FaUserCircle className="mr-2 text-violet-600 text-xl sm:text-2xl" />
            Enter name
          </label>
          <input
            id="name-input"
            type="text"
            className="w-52 px-4 py-2 rounded-lg text-white bg-[#1b1530]/60 backdrop-blur-md placeholder-purple-300 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
          className="w-52 px-4 py-2 rounded-lg text-white bg-[#1b1530]/60 backdrop-blur-md placeholder-purple-300 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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