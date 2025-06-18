import React from 'react';

export default function PlayerKickedScreen({ kickedName, isSpy, proceed }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6 bg-purple-900 text-white px-4">
      <h1 className="text-4xl font-bold">Player Kicked</h1>
      <p className="text-2xl">
        {kickedName} was kicked!
      </p>
      <p className="text-lg">
        {isSpy ? "The spy has been caught!" : "Citizens made the wrong choice."}
      </p>
      <button
        onClick={proceed}
        className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-lg font-semibold shadow-lg"
      >
        Next Round →
      </button>
    </div>
  );
}
