import { VoiceChannel } from "discord.js";
import { websocket } from "..";

export default function EndTranscription(id: string, voiceChannel: VoiceChannel) {
    websocket.sendToRoom(voiceChannel.id, "EndTranscription", {
        id
    });
}