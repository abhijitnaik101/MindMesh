// ------------------------------
// server.js (updated reconnect and disconnect handling)
// ------------------------------

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const wordMatrix = require('./wordMatrix');

const rooms = {}; // roomId -> room object
const disconnectedPlayers = {}; // socketId -> { roomId, playerName, timeout }

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function generateWords() {
  const randomRow = wordMatrix[Math.floor(Math.random() * wordMatrix.length)];
  const codeWord = randomRow[Math.floor(Math.random() * randomRow.length)];
  return { codeWord, relatedWords: randomRow };
}

function createRoom(roomId) {
  rooms[roomId] = {
    players: [],
    spy:null,
    codeWord: '',
    relatedWords: [],
    hints: [],
    usedWords: [],
    suspicionMarks: [],
    votes: [],
    voteReady: new Set(),
    spyGuessed: false,
    spyIsGuessing: false,
    gameStarted: false,
    kickMarks: [],
  };
}

function resetRoom(roomId) {
  delete rooms[roomId];
}

function assignRoles(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  room.hints = [];
  room.usedWords = [];
  room.suspicionMarks = [];
  room.votes = [];
  room.voteReady.clear();
  room.spyGuessed = false;
  room.spyIsGuessing = false;

  const { codeWord, relatedWords } = generateWords();
  room.codeWord = codeWord;
  room.relatedWords = relatedWords;

  const spyIndex = Math.floor(Math.random() * room.players.length);
  room.players.forEach((player, index) => {
    player.role = index === spyIndex ? 'spy' : 'citizen';
    player.isAlive = true;
    player.isReady = false;
  });
  room.spy = room.players[spyIndex];
  room.gameStarted = true;
}
function endGameGuess(roomId){
  let winner = 'citizens';
  const room = rooms[roomId];
  if (!room) return;
  if (room.spyGuessed) {
    winner = 'spy';
  }
  const spy = room.spy;
  io.to(roomId).emit('gameOver', { winner, codeWord: room.codeWord, spy: spy.name});

}
function endGame(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  const spy = room.spy;
  const alivePlayers = room.players.filter(p => p.isAlive);
  if (alivePlayers.some(p => p.role === 'spy')) {
    if (alivePlayers.length <= 2) {
      let winner = 'spy';
      io.to(roomId).emit('gameOver', { winner, codeWord: room.codeWord, spy: spy.name });
    }
  }
  else {
    let winner = 'citizens';
    io.to(roomId).emit('gameOver', { winner, codeWord: room.codeWord, spy: spy.name });
  }

}

function startNextRound(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  room.votes = [];
  room.hints = [];
  room.suspicionMarks = [];
  room.voteReady.clear();
  room.spyIsGuessing = false;
  room.kickMarks = [];

  const alivePlayers = room.players.filter(p => p.isAlive);
  if (room.spyGuessed || alivePlayers.length <= 2) {
    endGame(roomId);
  } else {
    io.to(roomId).emit('nextRound', { message: 'New round — submit your hints.' });
  }
}

io.on('connection', socket => {
  console.log('😺', socket.id, 'connected');

  socket.on('reconnectAttempt', ({ oldSocketId }) => {
    const playerData = disconnectedPlayers[oldSocketId];
    if (playerData) {
      const { roomId } = playerData;
      const room = rooms[roomId];
      if (room) {
        const player = room.players.find(p => p.id === oldSocketId);
        if (player) {
          clearTimeout(playerData.timeout);
          player.id = socket.id;
          socket.join(roomId);
          io.to(roomId).emit('lobbyUpdate', { players: room.players });
          delete disconnectedPlayers[oldSocketId];
          console.log('🔄 Player reconnected:', player.name);
        }
      }
    }
  });

  socket.on('createRoom', ({ playerName }) => {
    const roomId = generateRoomCode();
    createRoom(roomId);
    rooms[roomId].players.push({
      id: socket.id, name: playerName, role: '', isAlive: true, isReady: false
    });
    socket.join(roomId);
    socket.emit('roomCreated', { roomId });
    io.to(roomId).emit('lobbyUpdate', { players: rooms[roomId].players }); // Added
  });

  socket.on('joinRoom', ({ roomId, playerName }) => {
    const room = rooms[roomId];
    if (!room) return socket.emit('error', { message: 'Room not found' });
    rooms[roomId].players.push({
      id: socket.id, name: playerName, role: '', isAlive: true, isReady: false
    });
    socket.join(roomId);
    io.to(roomId).emit('lobbyUpdate', { players: room.players });
  });

  socket.on('playerReady', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (player) player.isReady = true;
    io.to(roomId).emit('lobbyUpdate', { players: room.players });

    if (room.players.every(p => p.isReady)) {
      assignRoles(roomId);
      room.players.forEach(player => {
        if (player.role === 'citizen') {
          io.to(player.id).emit('roleAssigned', { role: 'citizen', codeWord: room.codeWord });
        } else {
          io.to(player.id).emit('roleAssigned', { role: 'spy', relatedWords: room.relatedWords });
        }
      });
    }
  });

  socket.on('submitHint', ({ roomId, hint }) => {
    const room = rooms[roomId];
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id && p.isAlive);
    if (!player) return;

    // Prevent multiple hints per round
    if (room.hints.some(h => h.playerId === player.id)) {
      return socket.emit('error', { message: 'You have already submitted your hint for this round.' });
    }

    const sanitizedHint = hint.trim().toLowerCase();
    if (room.usedWords.includes(sanitizedHint)) {
      return socket.emit('error', { message: 'Word already used' });
    }
    if (player.role === 'citizen' && sanitizedHint === room.codeWord.toLowerCase()) {
      return socket.emit('error', { message: 'Cannot use code word' });
    }

    room.hints.push({ playerId: player.id, playerName: player.name, hint: sanitizedHint });
    room.usedWords.push(sanitizedHint);
    io.to(roomId).emit('usedWordsUpdate', { usedWords: room.usedWords });

    const aliveCount = room.players.filter(p => p.isAlive).length;
    if (room.hints.length === aliveCount) {
      io.to(roomId).emit('allHintsSubmitted', { hints: room.hints });
    }
  });

  socket.on('markSuspect', ({ roomId, suspectId }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.suspicionMarks.push({ markerId: socket.id, suspectId });
    io.to(roomId).emit('suspectUpdate', { suspicionMarks: room.suspicionMarks });
  });

  socket.on('proceedToVote', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player || !player.isAlive) return; // ❌ Dead players can't proceed

    room.voteReady.add(socket.id);
    const aliveCount = room.players.filter(p => p.isAlive).length;
    if (room.voteReady.size === aliveCount) {
      io.to(roomId).emit('startVoting');
    }
  });


  socket.on('submitVote', ({ roomId, votedId }) => {
    const room = rooms[roomId];
    if (!room) return;

    const voter = room.players.find(p => p.id === socket.id);
    if (!voter || !voter.isAlive) return; // ❌ Dead players can't vote

    room.votes.push({ voterId: socket.id, votedId: votedId ?? null });
    const aliveCount = room.players.filter(p => p.isAlive).length;

    if (room.votes.length === aliveCount) {
      const voteCounts = {};
      room.votes.forEach(vote => {
        if (vote.votedId) voteCounts[vote.votedId] = (voteCounts[vote.votedId] || 0) + 1;
      });
      const majorityKickId = Object.keys(voteCounts)
        .find(id => voteCounts[id] > Math.floor(aliveCount / 2));
      if (majorityKickId) {
        const kickedPlayer = room.players.find(p => p.id === majorityKickId);
        room.players.forEach((player) => player.isAlive = (player.id === majorityKickId) ? false : player.isAlive);
        if (kickedPlayer) {
          kickedPlayer.isAlive = false;
          io.to(roomId).emit('playerKicked', {
            kickedPlayerId: kickedPlayer.id,
            kickedPlayerName: kickedPlayer.name,
            isSpy: kickedPlayer.role === 'spy'
          });
          endGame(roomId);
        }

      } else {
        io.to(roomId).emit('noMajority', { message: 'No majority, next round.' });
      }
      startNextRound(roomId);
    }
  });


  socket.on('markKick', ({ roomId, votedId }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.kickMarks = room.kickMarks.filter(k => k.markerId !== socket.id);
    room.kickMarks.push({ voterId: socket.id, votedId });
    io.to(roomId).emit('kickMarksUpdate', { kickMarks: room.kickMarks });
  });


  socket.on('spyIsGuessing', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.spyIsGuessing = true;
    io.to(roomId).emit('spyIsGuessing', { spyIsGuessing: true });
  });

  socket.on('spyGuess', ({ roomId, guessWord }) => {
    const room = rooms[roomId];
    if (!room) return;
    const spyPlayer = room.players.find(p => p.id === socket.id && p.role === 'spy');
    if (!spyPlayer) return;
    io.to(roomId).emit('spyIsGuessing', { spyIsGuessing: false });

    room.spyGuessed = guessWord.trim().toLowerCase() === room.codeWord.toLowerCase();
    endGameGuess(roomId);
  });

  socket.on('nextGame', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;
    room.players.forEach(p => {
      p.isReady = false;
      p.isAlive = true;
      p.role = '';
    });
    room.spy = null;
    room.gameStarted = false;
    room.hints = [];
    room.usedWords = [];
    room.suspicionMarks = [];
    room.votes = [];
    room.spyGuessed = false;
    room.spyIsGuessing = false;
    room.voteReady.clear();

    io.to(roomId).emit('lobbyUpdate', { players: room.players });
    io.to(roomId).emit('nextGame', { message: 'Game reset — ready up again!' });
  });

  socket.on('disconnect', () => {
    console.log('😿', socket.id, 'disconnected');
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        if (!room.gameStarted) {
          // Game not started: remove immediately
          room.players = room.players.filter(p => p.id !== socket.id);
          if (room.players.length === 0) resetRoom(roomId);
          else io.to(roomId).emit('lobbyUpdate', { players: room.players });
        } else {
          //Game started: wait 10 seconds for reconnection
          const timeout = setTimeout(() => {
            if (disconnectedPlayers[socket.id]) {
              room.players = room.players.filter(p => p.id !== socket.id);
              if (room.players.length === 0) resetRoom(roomId);
              else io.to(roomId).emit('lobbyUpdate', { players: room.players });
              delete disconnectedPlayers[socket.id];
              console.log('💀 Player permanently disconnected:', player.name);
            }
          }, 10000);
          disconnectedPlayers[socket.id] = { roomId, playerName: player.name, timeout };
        }
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
