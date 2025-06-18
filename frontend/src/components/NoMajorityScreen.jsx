import React from 'react';

export default function NoMajorityScreen({ message, proceed }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6 bg-purple-900 text-white px-4">
      <h1 className="text-4xl font-bold">No Majority Vote</h1>
      <p className="text-xl">{message}</p>
      <button
        onClick={proceed}
        className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg"
      >
        Continue →
      </button>
    </div>
  );
}
