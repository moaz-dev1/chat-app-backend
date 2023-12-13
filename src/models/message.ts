import PrivateRoom from "./room";
import PublicRoom from "./group";
import User from "./user";

export default interface Message {
    id: number;
    sender: User;
    receiver: User;
    content: string;
    sentTime: Date;
    room: PrivateRoom | PublicRoom;
}