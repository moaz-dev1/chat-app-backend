import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import express from "express";
import User from "../models/user";
import Message from "../models/message";
import Room from "../models/room";

const app = express();
const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
});

interface Client {
    userId: number;
    socketId: string;
}

let allClients: Client[] = [];

const getSocketId = (userId: number) => {
    let socketId = "";
    allClients.map((client: Client) => {
        if(client.userId === userId) {
            socketId = client.socketId;
        }
    });

    return socketId;
}

io.on('connection', (socket) => {
    console.log('Connected');
    handleLogin(socket);
    handleRoomCreation(socket);
    handleJoinRoom(socket);
    handleMessage(socket);
    handleDisconnect(socket);
});
  

function handleLogin(socket: Socket) {
    try {
        socket.on('login', (user: User) => {
            allClients = allClients.filter((client) => client.userId != user.id);
            allClients.push({userId: user.id, socketId: socket.id});
    
            io.emit('show clients', allClients);
        });
    } catch (error) {
        throw error;
    }
};
  
function handleRoomCreation(socket: Socket) {
    try {
        socket.on('create room', (room: Room) => {
            socket.join(String(room.id));
            const otherSocketId = getSocketId(room.user2.id);
            if(otherSocketId) {
                socket.broadcast.to(otherSocketId).emit('invite', room);
                console.log(socket.id + ' Created room: ' + room.id);
            }
            else 
                console.log("Cannot find Socket Id");
        });
    } catch (error) {
        throw error;
    }
  }
  
function handleJoinRoom(socket: Socket) {
    try {
        socket.on('join', (room: Room) => {
            socket.join(String(room.id));
            console.log(socket.id + ' Joined room: ' + room.id);
        });
    } catch (error) {
        throw error;
    }
  }
  
function handleMessage(socket: Socket) {
    try {
        socket.on('message to server', (message: Message) => {
            // console.log(socket.id + ' Sent: ' + message.content);
            io.to(String(message.room.id)).emit('message to client', message);
        });
    } catch (error) {
        throw error;
    }
}
  
function handleDisconnect(socket: Socket) {
    try {
        socket.on('disconnect', () => {
            allClients = allClients.filter((client) => client.socketId != socket.id);
            console.log("Disconnected");
            io.emit('show clients', allClients);
        });
    } catch (error) {
        throw error;
    }
}
  
export default httpServer;

