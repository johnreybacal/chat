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
export interface UserLeft extends Event {
  type: "userLeft";
}

export type RoomEvent = Message | UserJoined | UserLeft;

export interface Room {
  name: string;
  unreadEvents: number;
  events: RoomEvent[];
}
