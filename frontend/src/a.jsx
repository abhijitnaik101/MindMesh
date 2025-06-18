import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', { autoConnect: false });

export default function App() {
  // UI screens
  const [screen, setScreen] = useState('home'); // home, lobby, game, gameOver
  const [error, setError] = useState('');

  // Player & room
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [players, setPlayers] = useState([]);

  // Game state
  const [role, setRole] = useState('');
  const [codeWord, setCodeWord] = useState('');
  const [related, setRelated] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [hints, setHints] = useState([]);
  const [suspects, setSuspects] = useState([]);
  const [phase, setPhase] = useState('hint'); // hint, suspect, vote
  const [hintInput, setHintInput] = useState('');
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to server');
      if (room && name) {
        socket.emit('reconnectToRoom', { roomId: room, playerName: name });
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setError('Disconnected. Attempting to reconnect...');
    });

    socket.io.on('reconnect', (attempt) => {
      console.log(`Reconnected after ${attempt} attempts`);
      setError('');
      if (room && name) {
        socket.emit('reconnectToRoom', { roomId: room, playerName: name });
      }
    });

    socket.on('roomCreated', ({ roomId }) => {
      setRoom(roomId);
      setScreen('lobby');
    });

    socket.on('lobbyUpdate', ({ players }) => setPlayers(players));

    socket.on('roleAssigned', ({ role, codeWord, relatedWords }) => {
      setRole(role);
      setCodeWord(codeWord || '');
      setRelated(relatedWords || []);
      setHints([]);
      setSuspects([]);
      setPhase('hint');
      setVoted(false);
      setError('');
      setScreen('game');
    });

    socket.on('usedWordsUpdate', ({ usedWords }) => setUsedWords(usedWords));

    socket.on('allHintsSubmitted', ({ hints }) => {
      setHints(hints);
      setPhase('suspect');
    });

    socket.on('suspectUpdate', ({ suspicionMarks }) => setSuspects(suspicionMarks));

    socket.on('startVoting', () => setPhase('vote'));

    socket.on('error', ({ message }) => setError(message));

    socket.on('playerKicked', ({ kickedPlayerName }) => {
      setError(`${kickedPlayerName} was kicked`);
      setPlayers((ps) =>
        ps.map((p) =>
          p.name === kickedPlayerName ? { ...p, isAlive: false } : p
        )
      );
    });

    socket.on('noMajority', ({ message }) => setError(message));

    socket.on('nextRound', ({ message }) => {
      setError(message);
      setHints([]);
      setSuspects([]);
      setPhase('hint');
      setVoted(false);
    });

    socket.on('spyIsGuessing', ({ spyIsGuessing }) => {
      if (spyIsGuessing) setError('Spy is guessing...');
    });

    socket.on('gameOver', ({ winner, codeWord }) => {
      setWinner(`${winner.toUpperCase()} wins! Word: "${codeWord}"`);
      setScreen('gameOver');
    });

    socket.on('nextGame', ({ message }) => {
      setError(message);
      setPlayers((ps) =>
        ps.map((p) => ({ ...p, isAlive: true, isReady: false, role: '' }))
      );
      setScreen('lobby');
    });

    return () => socket.off();
  }, [room, name]); // important: dependencies

  // Actions
  const createRoom = () => {
    if (name) {
      socket.emit('createRoom', { playerName: name });
    }
  };

  const joinRoom = () => {
    if (name && joinCode) {
      socket.emit('joinRoom', { roomId: joinCode, playerName: name });
      setRoom(joinCode);
      setScreen('lobby');
    }
  };

  const readyUp = () => socket.emit('playerReady', { roomId: room });

  const submitHint = () => {
    if (!hintInput.trim()) return;
    socket.emit('submitHint', { roomId: room, hint: hintInput });
    setHintInput('');
  };

  const markSuspect = (id) => socket.emit('markSuspect', { roomId: room, suspectId: id });

  const proceedVote = () => socket.emit('proceedToVote', { roomId: room });

  const submitVote = (id) => {
    if (!voted) {
      socket.emit('submitVote', { roomId: room, votedId: id });
      setVoted(true);
    }
  };

  const spyGuess = () => {
    socket.emit('spyIsGuessing', { roomId: room });
    const g = prompt('Your guess:');
    if (g) socket.emit('spyGuess', { roomId: room, guessWord: g });
  };

  const replay = () => socket.emit('nextGame', { roomId: room });

  const alive = players.filter((p) => p.isAlive);


  // Render
  if (screen === 'home') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-3xl font-semibold mb-4">MindMesh</h1>
        <input
          className="border rounded px-3 py-2 mb-2 w-64"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded px-4 py-2 mb-4 w-64"
          onClick={createRoom}
        >
          Create Room
        </button>
        <input
          className="border rounded px-3 py-2 mb-2 w-64"
          placeholder="Room Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded px-4 py-2 w-64"
          onClick={joinRoom}
        >
          Join Room
        </button>
        {error && (
          <div className="text-red-600 mt-2 text-sm">{error}</div>
        )}
      </div>
    );
  }

  if (screen === 'lobby') {
    return (
      <div className="h-screen flex flex-col items-center bg-gray-100 p-6">
        <h2 className="text-2xl font-medium mb-4">Room: {room}</h2>
        <ul className="w-64 divide-y divide-gray-200 mb-4">
          {players.map((p) => (
            <li key={p.id} className="py-2 text-gray-700">
              {p.name}
            </li>
          ))}
        </ul>
        <button
          className="bg-green-600 text-white rounded px-4 py-2"
          onClick={readyUp}
        >
          Ready
        </button>
      </div>
    );
  }

  if (screen === 'game') {
    return (
      <div className="h-screen flex flex-col items-center bg-gray-50 p-6 space-y-4">
        <h2 className="text-xl font-medium">
          Role: {role.toUpperCase()}
        </h2>
        {error && (
          <div className="text-red-600">{error}</div>
        )}
        {phase === 'hint' && (
          <div className="w-80 space-y-3">
            {role === 'citizen' ? (
              <p className="text-gray-800">
                Code Word:{' '}
                <span className="font-bold">{codeWord}</span>
              </p>
            ) : (
              <div>
                <p className="text-gray-800 mb-1">
                  Related Words:
                </p>
                <ul className="list-disc list-inside mb-2">
                  {related.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
                <button
                  className="bg-yellow-500 text-white rounded px-3 py-1 mb-2"
                  onClick={spyGuess}
                >
                  Guess
                </button>
              </div>
            )}
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Your Hint"
              value={hintInput}
              onChange={(e) => setHintInput(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 w-full"
              onClick={submitHint}
            >
              Submit Hint
            </button>
          </div>
        )}
        {phase === 'suspect' && (
          <div className="w-80 space-y-3">
            <h3 className="font-medium">Suspect</h3>
            {hints.map((h) => (
              <div
                key={h.playerId}
                className="border rounded p-2"
              >
                <p className="font-semibold">
                  {h.playerName}:
                </p>
                <p className="italic text-gray-600 mb-1">
                  {h.hint}
                </p>
                {alive.some((p) => p.id === h.playerId) && (
                  <button
                    className="text-red-500 text-sm"
                    onClick={() =>
                      markSuspect(h.playerId)
                    }
                  >
                    Suspect
                  </button>
                )}
                {suspects
                  .filter((s) => s.suspectId === h.playerId)
                  .map((s, i) => (
                    <p
                      key={i}
                      className="text-red-600 text-xs"
                    >
                      {
                        players.find(
                          (p) => p.id === s.markerId
                        )?.name
                      }{' '}
                      suspected
                    </p>
                  ))}
              </div>
            ))}
            <button
              className="bg-green-600 text-white rounded px-4 py-2 w-full"
              onClick={proceedVote}
            >
              Proceed to Vote
            </button>
          </div>
        )}
        {phase === 'vote' && (
          <div className="w-80 space-y-3">
            <h3 className="font-medium">Vote</h3>
            {alive.map((p) => (
              <button
                key={p.id}
                className={`w-full text-left px-3 py-2 rounded ${
                  voted
                    ? 'bg-gray-300 text-gray-600'
                    : 'bg-red-600 text-white'
                }`}
                disabled={voted}
                onClick={() => submitVote(p.id)}
              >
                {p.name}
              </button>
            ))}
            {!voted && (
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={() => submitVote(null)}
              >
                Skip
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (screen === 'gameOver') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6 space-y-4">
        <h1 className="text-2xl font-bold text-red-600">
          Game Over
        </h1>
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

  return null;
}
