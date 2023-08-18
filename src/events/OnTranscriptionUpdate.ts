import { VoiceChannel } from "discord.js";
import * as websocket from "@cousinear/services/websocket";

export interface TranscriptionUpdate {
    text: string;
}

export default function OnTranscriptionUpdate(id: string, voiceChannel: VoiceChannel,update: TranscriptionUpdate) {
    websocket.UpdateTranscription(id, voiceChannel, update);
}