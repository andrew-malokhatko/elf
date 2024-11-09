import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/types/socket/ServerIoResponse";
import sendmessage from "../sendmessage";

export const config = {
  api: {
    bodyParser: false,
  },
};

var connectedClients = 0;
const connectedUsers = new Map();

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {

    if (res.socket?.server?.io) {
      res.status(200).json({ success: true, message: "Socket is already running"})
      return
    }

    console.log("New Socket.io server created");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Set up event listeners only once when creating the server
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
      const userId = socket.handshake.auth.userId;
      if (!userId) {
        socket.disconnect();
        return;
      }

      connectedUsers.set(userId, socket);

      connectedClients++;
      socket.data.userId = userId;
      console.log(`User ${userId} connected`);
      console.log(`Now connected clients: ${connectedClients}`);

      socket.on("disconnect", () => {
        console.log("Reached disconnect");
        connectedUsers.delete(userId);
        connectedClients--;
        console.log(`Now connected clients: ${connectedClients}`);
      });

      socket.on("sendmessage", (data: { text: string; sentAt: Date; to: string }) => {
        console.log("> Reached sendMessage");
        const sent = sendmessage(socket.data.userId, data.to, data.text);

        if (!sent) {
          return;
        }

        console.log("> Yes Message");

        const recipientSocket = connectedUsers.get(data.to);
        console.log(recipientSocket ? "Found recipient socket" : "No recipient socket");

        if (recipientSocket) {
          recipientSocket.emit("receivemessage", {
            from: socket.data.userId,
            text: data.text,
            sentAt: data.sentAt
          });
        }
      });
    });

    res.socket.server.io = io;
};

export default ioHandler;
