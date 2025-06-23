import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import PlayerKickedScreen from './components/PlayerKickedScreen';
import NoMajorityScreen from './components/NoMajorityScreen';


const socket = io('https://mindmesh-7zpy.onrender.com', { autoConnect: false });
//const socket = io('http://localhost:4000/', { autoConnect: false });

export default function App() {
  // UI screens
  const [screen, setScreen] = useState('home'); // home, lobby, game, gameOver
  const [error, setError] = useState('');

  // Player & room
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Game state
  const [socketId, setSocketId] = useState('');
  const [role, setRole] = useState('');
  const [codeWord, setCodeWord] = useState('');
  const [related, setRelated] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [hints, setHints] = useState([]);
  const [suspects, setSuspects] = useState([]);
  const [phase, setPhase] = useState('hint'); // hint, suspect, vote
  const [hintInput, setHintInput] = useState('');
  const [voted, setVoted] = useState(false);
  const [kickMarks, setKickMarks] = useState([]);
  const [winner, setWinner] = useState('');
  const [kickedInfo, setKickedInfo] = useState(null); // { name: string, isSpy: boolean }
  const [noMajorityMessage, setNoMajorityMessage] = useState('');


  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to server');
      setSocketId(socket.id); // ✅ Store own socket ID
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

    socket.on('kickMarksUpdate', ({ kickMarks }) => {
      setKickMarks(kickMarks);
    });    

    socket.on('error', ({ message }) => setError(message));

    socket.on('playerKicked', ({ kickedPlayerId, kickedPlayerName, isSpy }) => {
      setKickedInfo({ id: kickedPlayerId, name: kickedPlayerName, isSpy });
      setScreen('kicked');
      setPlayers((prev) =>
        prev.map(p => p.id === kickedPlayerId ? { ...p, isAlive: false } : p)
      );
      
    });
    
    
    socket.on('noMajority', ({ message }) => {
      setNoMajorityMessage(message);
      setScreen('noMajority');
    });
    

    socket.on('nextRound', ({ message }) => {
      setError(message);
      setKickMarks([]);
      setHints([]);
      setSuspects([]);
      setPhase('hint');
      setVoted(false);
    });

    socket.on('spyIsGuessing', ({ spyIsGuessing }) => {
      if (spyIsGuessing) setError('Spy is guessing...');
    });

    socket.on('gameOver', ({ winner, codeWord, spy }) => {
      //setWinner(`${winner.toUpperCase()} wins! Word: "${codeWord}"`);
      setWinner([winner.toLowerCase(), codeWord, spy]);
      setScreen('gameOver');
    });

    socket.on('nextGame', ({ message }) => {
      setError(message);
      setPlayers((ps) =>
        ps.map((p) => ({ ...p, isAlive: true, isReady: false, role: '' }))
      );
      setIsReady(false);
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

  const readyUp = () => {
    socket.emit('playerReady', { roomId: room });
    setIsReady(true);
  }

  const submitHint = () => {
    if (!hintInput.trim()) return;
    socket.emit('submitHint', { roomId: room, hint: hintInput });
    setHintInput('');
  };

  const markSuspect = (id) => socket.emit('markSuspect', { roomId: room, suspectId: id });

  const proceedVote = () => socket.emit('proceedToVote', { roomId: room });

  const submitVote = (id) => {
    if (!voted) {
      socket.emit('markKick', { roomId: room, votedId: id });
      socket.emit('submitVote', { roomId: room, votedId: id });
      setVoted(true);
    }
  };

  const spyGuess = () => {
    socket.emit('spyIsGuessing', { roomId: room });
    const g = prompt('Your guess:');
    if (g) socket.emit('spyGuess', { roomId: room, guessWord: g });
  };

  const proceedAfterKickedOrNoMajority = () => {
    setKickMarks([]);
    setHints([]);
    setSuspects([]);
    setKickedInfo(null);
    setNoMajorityMessage('');
    setPhase('hint');
    setVoted(false);
    setScreen('game');
  };
  

  const replay = () => setTimeout(socket.emit('nextGame', { roomId: room }), 2000);

  const alive = players.filter((p) => p.isAlive);

  // Render
  if (screen === 'home') {
    return (
      <HomeScreen
        name={name}
        setName={setName}
        createRoom={createRoom}
        joinRoom={joinRoom}
        joinCode={joinCode}
        setJoinCode={setJoinCode}
        error={error}
      />
    );
  }
  if (screen === 'lobby') {
    return <LobbyScreen room={room} players={players} ready={isReady} readyUp={readyUp} />;
  }
  
  if (screen === 'game') {
    const currentPlayer = players.find((p) => p.id === socketId);
    const isAliveSelf = currentPlayer ? currentPlayer.isAlive : false;
    return (
      <GameScreen
        isAliveSelf={isAliveSelf}
        role={role}
        codeWord={codeWord}
        related={related}
        phase={phase}
        hintInput={hintInput}
        setHintInput={setHintInput}
        hints={hints}
        alive={alive}
        suspects={suspects}
        players={players}
        voted={voted}
        submitHint={submitHint}
        markSuspect={markSuspect}
        proceedVote={proceedVote}
        submitVote={submitVote}
        kickMarks={kickMarks}
        spyGuess={spyGuess}
        error={error}
      />
    );
  }
  
  if (screen === 'gameOver') {
    return <GameOverScreen winner={winner} replay={replay} />;
  }

  if (screen === 'kicked') {
    return <PlayerKickedScreen kickedName={kickedInfo.name} isSpy={kickedInfo.isSpy} proceed={proceedAfterKickedOrNoMajority} />;
  }
  
  if (screen === 'noMajority') {
    return <NoMajorityScreen message={noMajorityMessage} proceed={proceedAfterKickedOrNoMajority} />;
  }  

  return null;
}
