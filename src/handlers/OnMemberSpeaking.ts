import { GuildMember, VoiceChannel } from "discord.js";
import { RecordVoiceToMP3 } from "../methods/RecordVoiceToMP3";
import CallWhisperCLI from "../methods/CallWhisperCLI";

export async function onMemberSpeaking(voiceChannel: VoiceChannel, member: GuildMember) {
    const mp3Path = await RecordVoiceToMP3(voiceChannel, member);
    const transcribedText = await CallWhisperCLI(mp3Path);

    console.log(`${member.displayName}: ${transcribedText}`);
}