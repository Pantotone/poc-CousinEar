import { VoiceChannel } from "discord.js";
import * as websocket from "../services/websocket";

export default function OnTranscriptionEnd(id: string, voiceChannel: VoiceChannel) {
    websocket.EndTranscription(id, voiceChannel);
}