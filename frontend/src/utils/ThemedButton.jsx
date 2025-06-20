import React from 'react';

export function BlueButton({ children, onClick }) {
  return (
    <button
      className="w-52 px-6 py-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 border-2 border-sky-400 shadow-[0_6px_0_#1D4ED8] hover:translate-y-[2px] hover:shadow-[0_4px_0_#1D4ED8] active:translate-y-[4px] active:shadow-[0_4px_0_#1D4ED8] transition-all duration-150"
      onClick={onClick}
    >
      <p className="[text-shadow:0px_3px_0_#1B9CD7] text-white font-bold">
        {children}
      </p>
    </button>
  );
}

export function RedButton({ children, onClick }) {
  return (
    <button
      className="w-52 px-6 py-2 rounded-xl bg-gradient-to-br from-rose-500 to-red-400 border-2 border-red-300 shadow-[0_6px_0_#bd0006] hover:translate-y-[2px] hover:shadow-[0_4px_0_#C53030] active:shadow-[0_4px_0_#C53030] active:translate-y-[4px] transition-all duration-150"
      onClick={onClick}
    >
      <p className="[text-shadow:0px_3px_0_#C53030] text-white font-bold">
        {children}
      </p>
    </button>
  );
}

export function YellowButton({ children, onClick }) {
  return (
    <button
      className="w-52 px-6 py-2 rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-400 border-2 border-yellow-100 shadow-[0_6px_0_#D69E2E] hover:translate-y-[2px] hover:shadow-[0_4px_0_#D69E2E] active:translate-y-[4px] transition-all duration-150"
      onClick={onClick}
    >
      <p className="[text-shadow:0px_2px_0_#D69E2E] text-white font-bold">
        {children}
      </p>
    </button>
  );
}

export function PurpleButton({ children, onClick }) {
  return (
    <button
      className="w-52 px-6 py-2 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-purple-400 shadow-[0_6px_0_#5B21B6] hover:translate-y-[2px] hover:shadow-[0_4px_0_#5B21B6] active:translate-y-[4px] transition-all duration-150"
      onClick={onClick}
    >
      <p className="[text-shadow:0px_2px_0_#5B21B6] text-white font-bold">
        {children}
      </p>
    </button>
  );
}

export function IndigoButton({ children, onClick }) {
  return (
    <button
      className="w-52 px-6 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-indigo-400 shadow-[0_6px_0_#3730a3] hover:translate-y-[2px] hover:shadow-[0_6px_0_#3730a3] active:translate-y-[4px] active:shadow-[0_6px_0_#3730a3] transition-all duration-150"
      onClick={onClick}
    >
      <p className="[text-shadow:0px_2px_0_#5B21B6] text-white font-bold">
        {children}
      </p>
    </button>
  );
}

export function TealButton({ children, onClick }) {
  return (
    <button
      className="w-52 px-6 py-2 rounded-xl bg-gradient-to-br from-teal-300 to-teal-500 border-2 border-teal-100 shadow-[0_6px_0_#0F766E] hover:translate-y-[2px] hover:shadow-[0_4px_0_#0F766E] active:shadow-[0_4px_0_#0F766E] active:translate-y-[4px] transition-all duration-150"
      onClick={onClick}
    >
      <p className="[text-shadow:0px_2px_0_#0F766E] text-white font-bold">
        {children}
      </p>
    </button>
  );
}

export function GreenButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-xl text-lg bg-gradient-to-br from-lime-500 to-green-500 border-2 border-green-200 shadow-[0_6px_0_#15803D] hover:translate-y-[2px] hover:shadow-[0_4px_0_#15803D] active:shadow-[0_4px_0_#15803D] active:translate-y-[4px] transition-all duration-150"
    >
      <p className="[text-shadow:0px_2px_0_#15803D] text-white font-bold">
        {children}
      </p>
    </button>
  );
}

export function WhiteButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-52 px-6 py-2 rounded-xl text-lg bg-white border-gray-200 shadow-[0_6px_0_#9CA3AF] hover:translate-y-[2px] hover:shadow-[0_4px_0_#9CA3AF] active:shadow-[0_4px_0_#9CA3AF] active:translate-y-[4px] transition-all duration-150"
    >
      <p className="text-gray-500 font-bold">
        {children}
      </p>
    </button>
  );
}


export function OrangeButton({ children, onClick }) {
  return (
    <button
      className="w-52 px-6 py-2 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 border-2 border-orange-300 shadow-[0_6px_0_#EA580C] hover:translate-y-[2px] hover:shadow-[0_4px_0_#EA580C] active:translate-y-[4px] transition-all duration-150"
      onClick={onClick}
    >
      <p className="[text-shadow:0px_2px_0_#EA580C] text-white font-bold">
        {children}
      </p>
    </button>
  );
}

export function DisabledButton({ children }) {
  return (
    <button
      className="w-52 px-6 py-2 rounded-xl bg-gray-400 border-2 border-gray-300 shadow-[0_0px_0_#9CA3AF] text-white font-bold opacity-60 cursor-not-allowed"
      disabled
    >
      <p className="[text-shadow:0px_2px_0_#6B7280]">
        {children}
      </p>
    </button>
  );
}
