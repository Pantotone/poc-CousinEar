import type { Server } from "http";

export type WebsocketEvents = "SelectChannel"|"NewTranscription"|"UpdateTranscription"|"EndTranscription";

export interface BaseWebSocket {
    attach(server: Server): void;
    sendToRoom(roomId: string, event: WebsocketEvents, content: unknown): void;
}