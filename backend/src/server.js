const app = require('./app');
const http = require('http');
const { setupSockets } = require('./sockets/gameSocket');

const server = http.createServer(app);

setupSockets(server); // Attach socket.io to server

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
