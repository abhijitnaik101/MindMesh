import React, { useState, useEffect } from 'react';
import { TealButton, YellowButton, DisabledButton } from '../utils/ThemedButton';

export default function GameScreen({
  isAliveSelf,
  role,
  codeWord,
  related,
  phase,
  hintInput,
  setHintInput,
  hints,
  alive,
  suspects,
  players,
  voted,
  submitHint,
  markSuspect,
  proceedVote,
  submitVote,
  kickMarks,
  spyGuess,
  error,
  playerId,
  socket, // Added prop for socket instance
}) {
  const [localSuspected, setLocalSuspected] = useState([]);
  const [hasVotedInSuspectPhase, setHasVotedInSuspectPhase] = useState(false);
  const [localKickMarks, setLocalKickMarks] = useState(null); // Track kickMarks locally

  // Reset states on new round
  useEffect(() => {
    if (!socket) return;
    socket.on('nextRound', () => {
      setLocalSuspected([]);
      setHasVotedInSuspectPhase(false);
      setLocalKickMarks([]); // Reset kickMarks on new round
    });
    return () => socket.off('nextRound');
  }, [socket]);

  // Sync localKickMarks with prop
  useEffect(() => {
    setLocalKickMarks(kickMarks);
  }, [kickMarks]);

  return (
    <div className="bg-[url('/bg1.png')] bg-cover bg-center bg-no-repeat min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
      <h1 className="text-4xl sm:text-5xl pb-4 mb-2 font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {isAliveSelf ? (role === 'spy' ? 'Spy' : 'Citizen') : 'Ghost'}
      </h1>
      <h2 className="text-base sm:text-lg m-4 tracking-wide text-purple-300 uppercase">Code Word</h2>

      {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}

      {phase === 'hint' && (
        <div class="w-full max-w-md text-center space-y-6">
          {role === 'spy' ? (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 w-full">
                {related.map((word, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-pink-600 to-purple-600 text-white font-semibold py-2 px-3 rounded-lg border-2 border-black shadow-md text-sm sm:text-base"
                  >
                    {word}
                  </div>
                ))}
              </div>
              <YellowButton onClick={spyGuess}>Guess</YellowButton>
            </div>
          ) : (
            <div className="text-2xl sm:text-3xl font-bold text-white">{codeWord}</div>
          )}

          <input
            className="w-full py-3 px-4 rounded-lg bg-purple-100 text-purple-800 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
            placeholder="Enter hint..."
            value={hintInput}
            onChange={(e) => setHintInput(e.target.value)}
          />
          {isAliveSelf ? (
            <TealButton onClick={submitHint}>Submit</TealButton>
          ) : (
            <DisabledButton>Submit</DisabledButton>
          )}
        </div>
      )}

      {phase === 'suspect' && (
        <div className="w-full max-w-md space-y-5 text-center mt-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-purple-200 tracking-wide">Mark Suspect</h3>
          {hints.map((h) => {
            const markers = suspects.filter((s) => s.suspectId === h.playerId);
            const isAlive = alive.some((p) => p.id === h.playerId);
            const hasSuspected = localSuspected.includes(h.playerId) || suspects.some((s) => s.suspectId === h.playerId && s.markerId === playerId);
            console.log(`Player ${h.playerName} (ID: ${h.playerId}): hasSuspected=${hasSuspected}, markers=`, markers);
            return (
              <div
                key={h.playerId}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between px-4 py-3 bg-[#2c1a47] rounded-2xl shadow-md gap-y-2"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-lg">
                    {h.playerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white font-medium text-base sm:text-lg">{h.playerName}</div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <div className="flex gap-1 max-w-[100px] overflow-x-auto no-scrollbar">
                    {markers.map((s, i) => {
                      const markerName = players.find((p) => p.id === s.markerId)?.name || '';
                      return (
                        <div
                          key={i}
                          className="min-w-[24px] h-6 rounded-full bg-yellow-400 text-[#2c1a47] font-bold text-xs flex items-center justify-center"
                        >
                          {markerName.charAt(0).toUpperCase()}
                        </div>
                      );
                    })}
                  </div>

                  {isAliveSelf ? (
                    hasSuspected ? (
                      <div className="px-3 py-1 rounded-full bg-gray-400 text-sm font-bold shadow-sm shrink-0">
                        sus
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setLocalSuspected([...localSuspected, h.playerId]);
                          markSuspect(h.playerId);
                        }}
                        className="px-3 py-1 rounded-full bg-pink-200 text-pink-800 text-sm font-bold shadow-sm shrink-0"
                      >
                        sus
                      </button>
                    )
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-gray-400 text-sm font-bold shadow-sm shrink-0">
                        out
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {hasVotedInSuspectPhase ? (
            <DisabledButton disabled className="w-full py-3 text-lg font-bold bg-gray-400 text-gray-600 rounded-xl shadow-md cursor-not-allowed">
              vote →
            </DisabledButton>
          ) : (
            <button
              onClick={() => {
                setHasVotedInSuspectPhase(true);
                proceedVote();
              }}
              className="w-full py-3 text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white rounded-xl shadow-md transition duration-200"
            >
              vote →
            </button>
          )}
        </div>
      )}

      {phase === 'vote' && (
        <div className="w-full max-w-md space-y-5 text-center mt-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-yellow-300 tracking-wide">Vote Player</h3>
          {alive.map((p) => {
            const markers = localKickMarks.filter((k) => k.votedId === p.id);
            console.log("markers: ", markers);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-3 bg-indigo-900 rounded-2xl shadow-md gap-y-2"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black font-bold text-lg">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white font-medium text-base sm:text-lg">{p.name}</div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {(!voted && isAliveSelf) ? (
                    <button
                      onClick={() => submitVote(p.id)}
                      className="px-3 py-1 rounded-full bg-yellow-300 text-[#472d2d] text-sm font-bold shadow-sm shrink-0"
                    >
                      vote
                    </button>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-gray-400 text-[#472d2d] text-sm font-bold shadow-sm shrink-0">voted</div>
                  )}

                  <div className="flex gap-1 max-w-[100px] overflow-x-auto no-scrollbar">
                    {markers.map((k, i) => {
                      const markerName = players.find((pl) => pl.id === k.voterId)?.name || '';
                      return (
                        <div
                          key={i}
                          className="min-w-[24px] h-6 rounded-full bg-orange-400 text-[#472d2d] font-bold text-xs flex items-center justify-center"
                        >
                          {markerName.charAt(0).toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          {!voted && (
            <button
              onClick={() => submitVote(null)}
              className="w-full py-3 text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-[#472d2d] rounded-xl shadow-md"
            >
              skip →
            </button>
          )}
        </div>
      )}
    </div>
  );
}