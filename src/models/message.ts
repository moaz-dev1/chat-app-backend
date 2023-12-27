import User from "./user";
import Room from "./room";
import Group from "./group";

export default interface Message {
    id: number;
    sender: User;
    receiver: User;
    content: string;
    sentTime: Date;
    room: Room | Group;
}