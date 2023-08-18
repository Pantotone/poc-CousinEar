import { GuildMember, VoiceChannel } from "discord.js";
import crypto from "node:crypto";
import processSpeak from "../services/speech-to-text";

export async function onMemberSpeaking(voiceChannel: VoiceChannel, member: GuildMember) {
    if(member.user.bot) return;
    
    const id = crypto.randomUUID();
    processSpeak(id, voiceChannel, member);
}