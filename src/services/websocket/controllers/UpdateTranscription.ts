import { VoiceChannel } from "discord.js";
import { websocket } from "..";
import { TranscriptionUpdate } from "../../../handlers/OnTranscriptionUpdate";

export default function UpdateTranscription(id: string, voiceChannel: VoiceChannel, update: TranscriptionUpdate) {
    websocket.sendToRoom(voiceChannel.id, "UpdateTranscription", {
        id,
        ...update
    });
}