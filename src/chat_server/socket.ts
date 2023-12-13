import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import express from "express";
import User from "../models/user";
import Message from "../models/message";
import Room from "../models/room";

const PORT = process.env.SOCKET_PORT || 3000;
const app = express();


const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
});

let clientSocketId: any[] = [];

const getSocketId = (userId: number) => {
    let socketId = "";
    clientSocketId.map((client) => {
        if(client.user.id === userId) {
            socketId = client.socketId;
        }
    });

    return socketId;
}

io.on('connection', (socket) => {
    handleLogin(socket);
    handleRoomCreation(socket);
    handleJoinRoom(socket);
    handleMessage(socket);
    handleDisconnect(socket);
});
  

function handleLogin(socket: Socket) {
    try {
        socket.on('login', (user: User) => {
            clientSocketId = clientSocketId.filter((client) => client.userId != user.id);
            clientSocketId.push({user: user, socketId: socket.id});
            // console.log(clientSocketId);
    
            io.emit('show clients', clientSocketId);
        });
    } catch (error) {
        throw error;
    }
};
  
function handleRoomCreation(socket: Socket) {
    try {
        socket.on('create room', (room: Room) => {
            socket.join(String(room.id));
            const userSocketId = getSocketId(room.id);
            if(userSocketId) {
                socket.broadcast.to(userSocketId).emit('invite', room.id);
                console.log("Room was created with id: " + room.id);
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
            // console.log("Joined Successfully to room: " + room);
        });
    } catch (error) {
        throw error;
    }
  }
  
function handleMessage(socket: Socket) {
    try {
        socket.on('message to server', (message: Message) => {
            io.to(String(message.room.id)).emit('message to client', message);
        });
    } catch (error) {
        throw error;
    }
}
  
function handleDisconnect(socket: Socket) {
    try {
        socket.on('disconnect', () => {
            clientSocketId = clientSocketId.filter((client) => client.socketId != socket.id);
            console.log(clientSocketId);
            console.log("Disconnected");
            io.emit('show clients', clientSocketId);
        });
    } catch (error) {
        throw error;
    }
}
  
httpServer.listen(PORT, () => console.log("Live..."));


