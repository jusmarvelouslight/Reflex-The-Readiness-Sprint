import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";

const PORT = Number(
  process.env.PORT || 5000
);

const frontendOrigins = (
  process.env.FRONTEND_URL || ""
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const httpServer =
  http.createServer(app);

export const io = new Server(
  httpServer,
  {
    cors: {
      origin: frontendOrigins.length
        ? frontendOrigins
        : true,
      credentials: true,
    },
  }
);

io.on("connection", (socket) => {
  console.log(
    `Socket connected: ${socket.id}`
  );

  socket.on(
    "join",
    (userId: string) => {
      socket.join(userId);

      console.log(
        `Socket ${socket.id} joined room ${userId}`
      );
    }
  );

  socket.on("disconnect", () => {
    console.log(
      `Socket disconnected: ${socket.id}`
    );
  });
});

httpServer.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Reflex API running on port ${PORT}`
    );
  }
);