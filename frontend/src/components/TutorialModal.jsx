import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function TutorialModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="h-2/3 overflow-scroll bg-gradient-to-br from-gray-800 to-gray-900 w-80 sm:w-96 rounded-xl p-6 shadow-xl text-white relative space-y-4 border border-gray-700">
        <h2 className="text-xl font-semibold tracking-wide text-indigo-300">How to Play</h2>
        <div className='h-4/5 overflow-scroll font-nunito no-scrollbar'>
          <h3 className='text-md font-medium tracking-widest py-3'>🎭 ROLES</h3>
          <hr className='my-2 text-gray-600'/>
          <p className='py-2 text-gray-400'>
            <strong className='text-gray-300'>Citizens:</strong> <br /> Know the same secret code word. <br/> All Citizens are on the same team.<br />
            <strong className='text-gray-300'>Spy:</strong> <br /> Gets 6 related words, including the actual code word, but doesn’t know which one it is.
          </p>

          <h3 className='text-md font-medium tracking-widest py-3'>🎯 OBJECTIVES</h3>
          <hr className='my-2 text-gray-600' />
          <p className='py-2 text-gray-400'>
            <strong className='text-gray-300'>Citizens:</strong> <br /> Find the Spy before they guess the code word or eliminate everyone.<br />
            <strong className='text-gray-300'>Spy:</strong> <br /> Either guess the code word correctly (only once!) or be the last player left.
          </p>


          <h3 className='text-md font-medium tracking-widest py-3'>🎮 GAME FLOW</h3>
          <hr className='my-2 text-gray-600' />
          <ol className="list-decimal pl-5 space-y-2 py-2 text-gray-300 font-semibold">
            <li>
              Each player submits one unique clue related to the code word.
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400 font-normal">
                <li>No repeating clues, even from previous rounds.</li>
                <li>No two players can give the same clue in the same round.</li>
              </ul>
            </li>
            <li>
              After all clues are submitted, players vote to eliminate one player.
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400 font-normal">
                <li>The player with the most votes is eliminated.</li>
                <li>If the Spy is eliminated, the Citizens win.</li>
                <li>If a Citizen is eliminated, the game continues to the next round.</li>
              </ul>
            </li>
            <li>
              The Spy can guess the code word at any time.
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400 font-normal">
                <li>If correct, the Spy wins immediately.</li>
                <li>If wrong, the Spy loses immediately.</li>
              </ul>
            </li>
            <li>
              If the Spy is the last player remaining, they win.
            </li>
          </ol>

          <h3 className='text-md font-medium tracking-widest py-3'>🏆 WIN CONDITIONS</h3>
          <hr className='my-2 text-gray-600' />
          <div className="space-y-2 py-2">
              <p className="font-semibold text-gray-300">Citizens win if:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-400">
                <li>The Spy is voted out.</li>
                <li>The Spy guesses the code word incorrectly.</li>
              </ul>

              <p className="font-semibold text-gray-300">Spy wins if:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-400">
                <li>They guess the code word correctly.</li>
                <li>They are the last remaining player.</li>
              </ul>
          </div>


          <h3 className='text-md font-medium tracking-widest py-3'>💡 TIPS</h3>
          <hr className='my-2 text-gray-600' />
          <p className='py-2 text-gray-400'>
            <strong className='text-gray-300'>Citizens:</strong> <br /> Be subtle but clear. Too obvious and the Spy might guess the word. Too vague and you might look suspicious.<br />
            <strong className='text-gray-300'>Spy:</strong> <br /> Blend in. Use the clues to figure out the real word. Only guess when you’re confident.
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
          title="Close"
        >
          <FaTimes size={18} />
        </button>
      </div>
    </div>
  );
}
