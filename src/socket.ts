import { io } from "socket.io-client";

// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";

const URL = process.env.SOCKET_URL ?? "http://localhost:4000";
export const socket = io(URL, {
  autoConnect: false,
});
