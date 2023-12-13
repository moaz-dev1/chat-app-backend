import Message from "./message";
import User from "./user";

export default interface Room {
    id: number;
    user1: User;
    user2: User;
    createdTime: Date;
    lastMessage?: Message;
    unreadCount?: { [userId: string]: number };
    status?: { [userId: string]: 'online' | 'offline' | 'away' };
    messages?: Message[];
}