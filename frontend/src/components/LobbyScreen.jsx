import React from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import { PurpleButton, GreenButton, IndigoButton } from '../utils/ThemedButton';

export default function LobbyScreen({ room, players, ready, readyUp }) {
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(room);
      } else {
        // Fallback for insecure contexts or unsupported browsers
        const textArea = document.createElement('textarea');
        textArea.value = room;
        textArea.style.position = 'fixed'; // Avoid scrolling to bottom on iOS
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy room code.');
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col justify-center items-center text-white px-4 py-6 font-sans overflow-hidden text-center">
      
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-white tracking-wide">
          MindMesh
        </h1>

        {/* Room Code */}
        <h2 className="text-gray-400 text-sm font-medium mb-1 tracking-widest">ROOM CODE</h2>
        <div className="flex items-center w-1/2 justify-between mb-6 bg-gray-800 rounded-lg px-3 py-2">
          <span className="text-lg font-mono text-indigo-300">{room}</span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-all active:scale-200 duration-500"
            title="Copy Room Code"
          >
            <FaCopy />
          </button>
        </div>

        {/* Players */}
        <h3 className="text-gray-300 text-sm mb-2 uppercase tracking-widest">Players</h3>
        <ul className="mb-6 w-1/2 space-y-1 text-left border border-gray-700 p-1 rounded-2xl h-40 overflow-x-scroll no-scrollbar">
          {players.map((p) => (
            <li key={p.id} className="flex items-center bg-gray-800 rounded-2xl space-x-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-sm">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-base truncate max-w-1/2">{p.name}</span>
            </li>
          ))}
        </ul>

        {/* Ready Button */}
        {ready ? (
          <GreenButton onClick={readyUp}><FaCheck/></GreenButton>
        ) : (
          <IndigoButton onClick={readyUp}>START</IndigoButton>
        )}
      
    </div>
  );
}
