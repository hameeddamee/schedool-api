let io;
let socket;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
  setSocket: (socketObj) => {
    socket = socketObj;
    return socket;
  },
  getSocket: () => {
    if (!socket) {
      throw new Error("Socket not established!");
    }
    return socket;
  },
};
