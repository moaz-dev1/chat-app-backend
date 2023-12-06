import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import express from "express";
import User from "../models/user";

const PORT = process.env.SOCKET_PORT || 3000;
const app = express();


const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    }, 
});

io.on('connection', (socket) => {
    console.log(socket);
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
        socket.on('create room', (data: any) => {
            socket.join(data.room); 
            const userSocketId = getSocketId(data.receiverID);
            if(userSocketId) {
                socket.broadcast.to(userSocketId).emit('invite', data.room);
                console.log("Room was created " + data.room);
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
        socket.on('join', (room: any) => {
            socket.join(room);
            // console.log("Joined Successfully to room: " + room);
        });
    } catch (error) {
        throw error;
    }
  }
  
function handleMessage(socket: Socket) {
    try {
        socket.on('message to server', (message: any) => {
            io.to(message.room).emit('message to client', message);
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
  
server.listen(PORT, () => console.log("Live..."));


