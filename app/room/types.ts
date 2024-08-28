export interface Event {
  socketId: string;
  username: string;
  date: Date;
  type: string;
}

export interface Message extends Event {
  message: string;
  type: "message";
}

export interface UserJoined extends Event {
  type: "userJoined";
}

export type RoomEvent = Message | UserJoined;

export interface Room {
  name: string;
  events: RoomEvent[];
}
