import { GuildMember, VoiceChannel } from "discord.js";
import * as websocket from "../services/websocket";

export default function OnTranscriptionStart(id: string, voiceChannel: VoiceChannel, member: GuildMember) {
    websocket.NewTranscription(id, voiceChannel, member);
}