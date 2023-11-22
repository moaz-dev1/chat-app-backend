export default interface Message {
    id?: number;
    senderName: string;
    receiverName: string;
    body: string;
    sentDate: Date;
}