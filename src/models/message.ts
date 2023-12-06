export default interface Message {
    id?: number;
    senderID: number;
    receiverID: number;
    senderName: string;
    receiverName: string;
    body: string;
    sentDate: Date;
}