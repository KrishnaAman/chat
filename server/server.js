import express from 'express'
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import {Server} from "socket.io"
import messageRouter from './routes/messageRoutes.js';

//express app and http server

const app = express();
const server = http.createServer(app)

//server with socket
export const io = new Server(server,{
    cors:{origin:"*"}
})
//store online user
export const userSocketMap = {};

//socket connection handler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected",userId);
    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log(" User disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
        
    })
    
})

//middleware

app.use(express.json({limit: "10mb"}))

app.use(cors())

//routes
app.use("/api/status",(req,res)=>res.send("Server is live"))
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)


//db connection
await connectDB();

if(process.env.NODE_ENV !== "production"){

const PORT =process.env.PORT || 5000;

server.listen(PORT, ()=>console.log("Server is running on port:" + PORT)
);
}
export default server;