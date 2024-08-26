export interface Message {
  message: string;
  user: string;
  date: Date;
}

export interface Room {
  name: string;
  messages: Message[];
}
