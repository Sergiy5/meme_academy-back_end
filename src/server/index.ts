import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GameRoomManager } from "../GameRoom";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

const roomManager = new GameRoomManager(io);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Room info endpoint
app.get("/room/:code", (req, res) => {
  const info = roomManager.getRoomInfo(req.params.code);
  res.json(info);
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("create_room", ({ nickname }: { nickname: string }) => {
    console.log("Creating room for:", nickname);
    roomManager.createRoom(socket, nickname);
  });

  socket.on(
    "join_room",
    ({ roomCode, nickname }: { roomCode: string; nickname: string }) => {
      console.log("Joining room:", roomCode, "as", nickname);
      roomManager.joinRoom(socket, roomCode, nickname);
    },
  );

  socket.on(
    "reconnect_room",
    ({ playerId, roomCode }: { playerId: string; roomCode: string }) => {
      console.log("Reconnecting:", playerId, "to", roomCode);
      roomManager.reconnect(socket, playerId, roomCode);
    },
  );

  socket.on("start_game", () => {
    console.log("Starting game");
    roomManager.startGame(socket);
  });

  socket.on("submit_meme", ({ memeId }: { memeId: string }) => {
    console.log("Submitting meme:", memeId);
    roomManager.submitMeme(socket, memeId);
  });

  socket.on("select_winner", ({ oderId }: { oderId: string }) => {
    console.log("Selecting winner:", oderId);
    roomManager.selectWinner(socket, oderId);
  });

  socket.on("next_round", () => {
    console.log("Next round");
    roomManager.nextRound(socket);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    roomManager.handleDisconnect(socket);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
});
