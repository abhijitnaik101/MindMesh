import { useEffect } from 'react';
import { socket } from '../utils/socketInstance';

export default function useSocket({ room, name, setStateHandlers }) {
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected');
      if (room && name) socket.emit('reconnectToRoom', { roomId: room, playerName: name });
    });

    socket.on('disconnect', () => setStateHandlers.setError('Disconnected. Attempting to reconnect...'));

    socket.io.on('reconnect', () => {
      setStateHandlers.setError('');
      if (room && name) socket.emit('reconnectToRoom', { roomId: room, playerName: name });
    });

    socket.on('roomCreated', ({ roomId }) => {
      setStateHandlers.setRoom(roomId);
      setStateHandlers.setScreen('lobby');
    });

    // ... Add the rest of the event listeners here using setStateHandlers

    return () => socket.off();
  }, [room, name]);
}
