import React from 'react';

export default function GameOverScreen({ winner, replay }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6 space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Game Over</h1>
      <p className="text-lg text-gray-700">{winner}</p>
      <button
        className="bg-blue-600 text-white rounded px-4 py-2"
        onClick={replay}
      >
        Play Again
      </button>
    </div>
  );
}
