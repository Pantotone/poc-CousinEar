import { Server, Socket } from "socket.io";
import http from "http";
import { BaseWebSocket, WebsocketEvents } from "./BaseWebsocket";

export class SocketIOModule implements BaseWebSocket {
    server: Server | undefined;
    
    attach(server: http.Server): void {
        this.server = new Server(server);
        this.server.on("connection", this.handleConnection.bind(this));
    }

    sendToRoom(roomId: string, event: WebsocketEvents, content: unknown): void {
        this.server?.to(roomId).emit(event, content);
    }

    handleConnection(socket: Socket) {
        if(process.env.DISCORD_TEST_VOICECHANNEL_ID) {
            socket.join(process.env.DISCORD_TEST_VOICECHANNEL_ID);
        }

        socket.on("SelectChannel", (data) => {
            socket.join(data.channelId);
        });
    }
}