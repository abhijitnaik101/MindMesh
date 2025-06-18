import React from 'react';
import { FaCopy } from 'react-icons/fa';
import { PurpleButton, GreenButton } from '../utils/ThemedButton';

export default function LobbyScreen({ room, players, ready, readyUp }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(room).then(() => {
      alert('Room code copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0c1d] text-white p-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-10">
        MindMesh
      </h1>

      <div className="bg-[#1b1035] p-6 rounded-2xl w-full max-w-xs text-center border-2 border-purple-500">
        {/* Room Code */}
        <h2 className="text-pink-400 text-xl font-bold mb-2">CODE</h2>
        <div className="flex items-center justify-center mb-6 space-x-3">
          <span className="text-cyan-300 text-2xl font-mono bg-[#220c4e] px-4 py-1 rounded-lg">
            {room}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-full text-white hover:text-indigo-600 bg-indigo-600 hover:bg-white transition duration-200"
            title="Copy Room Code"
          >
            <FaCopy className="text-xl" />
          </button>
        </div>

        {/* Players List */}
        <h3 className="text-pink-500 text-xl font-bold mb-3">players</h3>
        <ul className="bg-[#270c47] rounded-xl px-4 py-2 mb-6 text-left text-cyan-200 divide-y divide-purple-400/30">
          {players.map((p) => (
            <li key={p.id} className="py-2 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg">{p.name}</span>
            </li>
          ))}
        </ul>

        {/* Start Button */}
        {ready ? (
      <GreenButton onClick={readyUp}>READY</GreenButton>
    ) : (
      <PurpleButton onClick={readyUp}>START</PurpleButton>
    )}
      </div>
    </div>
  );
}
