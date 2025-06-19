import React, { useState, useEffect } from 'react';
import { TealButton, YellowButton, DisabledButton, OrangeButton, BlueButton, WhiteButton } from '../utils/ThemedButton';

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
    <div className="min-h-screen bg-gray-900 w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
      <h1 className="text-4xl sm:text-5xl pb-4 mb-2 font-extrabold text-white">
        {isAliveSelf ? (role === 'spy' ? 'Spy' : 'Citizen') : 'Ghost'}
      </h1>

      {error && <div className="text-white mb-2 py-1 px-3 font-semibold bg-pink-500 rounded-full text-sm sm:text-base">{error}</div>}

      <h2 className="text-gray-400 text-sm font-medium mb-4 tracking-widest uppercase">
        {(role === 'spy') ? 'Words' : 'Code Word'}
      </h2>



      {phase === 'hint' && (
        <div class="w-full max-w-md flex flex-col items-center text-center space-y-6">
          {role === 'spy' ? (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 gap-2 sm:gap-2 mb-4 w-full">
                {related.map((word, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-amber-600 to-orange-500 lg:brightness-100 text-white font-medium py-2 px-4 rounded-lg border-1 border-white hover:bg-rose-600 transition-transform duration-200 text-sm sm:text-base text-center"
                  >
                    {word}
                  </div>
                ))}
              </div>

              {/* <YellowButton onClick={spyGuess}>Guess</YellowButton> */}
              <OrangeButton onClick={spyGuess}>GUESS</OrangeButton>
            </div>
          ) : (
            <div className="text-xl sm:text-xl bg-blue-500 py-2 px-4 rounded-lg w-max font-bold text-white">{codeWord}</div>
          )}

          <input
            className="w-3/4 py-3 px-4 rounded-lg bg-purple-100 text-black font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
            placeholder="Enter hint..."
            value={hintInput}
            onChange={(e) => setHintInput(e.target.value)}
          />
          {isAliveSelf ? (
            <BlueButton onClick={submitHint}>SUBMIT</BlueButton>
          ) : (
            <DisabledButton>SUBMIT</DisabledButton>
          )}
        </div>
      )}

      {phase === 'suspect' && (
        <div className="w-4/5 max-w-md text-center mt-6">
          <h3 className="text-xl sm:text-xl font-bold text-gray-200 tracking-wide mb-2">Mark Suspect</h3>
          <div className='mb-2 p-2 border border-gray-700 rounded-2xl space-y-1 h-48 overflow-scroll no-scrollbar'>
            {hints.map((h) => {
              const markers = suspects.filter((s) => s.suspectId === h.playerId);
              const isAlive = alive.some((p) => p.id === h.playerId);
              const hasSuspected = localSuspected.includes(h.playerId) || suspects.some((s) => s.suspectId === h.playerId && s.markerId === playerId);

              return (
                <div
                  key={h.playerId}
                  className="flex sm:flex-nowrap items-center justify-between p-1 bg-slate-800 rounded-full shadow-lg gap-y-2"
                >
                  {/* Player Info */}
                  <div className="flex items-center gap-3 sm:w-auto">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-sm">
                      {h.playerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-white font-medium text-base sm:text-lg tracking-wide">
                      {h.playerName}
                    </div>
                  </div>

                  {/* Markers + Suspect Button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* Marker Badges */}
                    <div className="flex gap-1 max-w-[100px] overflow-x-auto no-scrollbar">
                      {markers.map((s, i) => {
                        const markerName = players.find((p) => p.id === s.markerId)?.name || '';
                        return (
                          <div
                            key={i}
                            className="min-w-[24px] h-6 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center justify-center"
                          >
                            {markerName.charAt(0).toUpperCase()}
                          </div>
                        );
                      })}
                    </div>

                    {/* Suspect Button */}
                    {isAliveSelf ? (
                      hasSuspected ? (
                        <div className="px-3 py-1 rounded-full bg-gray-400 text-gray-800 text-sm font-bold shrink-0">
                          sus
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setLocalSuspected([...localSuspected, h.playerId]);
                            markSuspect(h.playerId);
                          }}
                          className="px-3 py-1 rounded-full bg-orange-500 hover:bg-rose-500 text-white text-sm font-bold shrink-0 transition"
                        >
                          sus
                        </button>
                      )
                    ) : (
                      <div className="px-3 py-1 rounded-full bg-gray-500 text-gray-200 text-sm font-bold shrink-0">
                        out
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {hasVotedInSuspectPhase ? (
            <DisabledButton disabled className="w-full py-3 text-lg font-bold bg-gray-400 text-gray-600 rounded-xl shadow-md cursor-not-allowed">
              vote →
            </DisabledButton>
          ) : (

            <OrangeButton onClick={() => {
              setHasVotedInSuspectPhase(true);
              proceedVote();
            }}>VOTE →</OrangeButton>
          )}
        </div>
      )}

      {phase === 'vote' && (
        <div className="w-4/5 max-w-md text-center mt-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-wide mb-2">Vote Player</h3>
          <div className='mb-2 p-2 border border-gray-700 rounded-2xl space-y-1 h-48 overflow-scroll no-scrollbar'>
          {alive.map((p) => {
            const markers = localKickMarks.filter((k) => k.votedId === p.id);
            
            return (
              <div
                key={p.id}
                className="flex sm:flex-nowrap items-center justify-between p-1 bg-slate-800 rounded-full shadow-lg gap-y-2"
              >

                {/* Player Info */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-sm">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-white font-medium text-base sm:text-lg">{p.name}</div>
                </div>

                {/* Markers + Vote Button */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {(!voted && isAliveSelf) ? (
                    <button
                      onClick={() => submitVote(p.id)}
                      className="px-3 py-1 rounded-full bg-red-500 text-red-100 text-sm font-bold shadow-sm shrink-0"
                    >
                      vote
                    </button>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-gray-400 text-[#472d2d] text-sm font-bold shadow-sm shrink-0">voted</div>
                  )}

                  {/* Vote Button */}
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
          </div>
          {!voted && (
            <WhiteButton onClick={() => submitVote(null)}>SKIP →</WhiteButton>
          )}
        </div>
      )}
    </div>
  );
}