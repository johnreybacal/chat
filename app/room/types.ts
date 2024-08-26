export interface Message {
  message: string;
  socketId: string;
  username: string;
  date: Date;
}

export interface Room {
  name: string;
  messages: Message[];
}
