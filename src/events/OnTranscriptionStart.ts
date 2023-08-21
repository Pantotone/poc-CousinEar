import { GuildMember } from "discord.js";
import * as websocket from "@cousinear/services/websocket";
import { AllowedTypeChannels } from "@cousinear/types";

export default function OnTranscriptionStart(id: string, voiceChannel: AllowedTypeChannels, member: GuildMember) {
    websocket.NewTranscription(id, voiceChannel, member);
}