import React from 'react';
import { FaCrown, FaRedoAlt, FaStar } from 'react-icons/fa';

export default function GameOverScreen({ winner, replay }) {
  return (
    <div className="min-h-screen w-full bg-gray-800 to-black flex flex-col items-center justify-center p-6 font-mono text-center ">
      

        {/* GAME OVER */}
        {/* GAME OVER */}
        <div className="mb-8 text-3xl sm:text-4xl font-bold text-white tracking-wide flex items-center gap-3">
          <FaStar className="text-yellow-500" />
          GAME OVER
          <FaStar className="text-yellow-500" />
        </div>


        {/* Winner Card */}
      
        <div className={`mb-8 w-3/4 rounded-2xl pb-6 px-4 shadow-inner ${winner[0] === 'spy' ? 'bg-red-500' : 'bg-blue-500'}`}>
          <h2 className="text-xl w-full p-2 bg-black rounded-b-full sm:text-2xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
            <FaCrown />
            Winner
          </h2>
          <p className="text-white text-2xl font-extrabold tracking-wide">
            {winner[0]} wins! <br/>
          </p>
          <span className='text-white'>code word</span>
          <p className='text-black p-1 bg-white rounded-full text-2xl font-extrabold tracking-wide'>{winner[1]}</p>
        </div>

        {/* Replay Button */}
        <button
          onClick={replay}
          className="mb-2 p-4 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-bold text-3xl shadow-[0_4px_0_#064e3b] hover:animate-spin hover:brightness-110 active:translate-y-[4px] duration-700 transition-all"
        >
          <FaRedoAlt />
        </button>
        <span className='text-white'>Play Again</span>

    </div>
  );
}
