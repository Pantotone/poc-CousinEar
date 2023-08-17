import { GuildMember, VoiceChannel } from "discord.js";
import { RecordVoiceToMP3 } from "../methods/RecordVoiceToMP3";
import CallWhisperCLI from "../methods/CallWhisperCLI";
import OnTranscriptionStart from "./OnTranscriptionStart";
import OnTranscriptionUpdate from "./OnTranscriptionUpdate";
import OnTranscriptionEnd from "./OnTranscriptionEnd";
import crypto from "node:crypto";

export async function onMemberSpeaking(voiceChannel: VoiceChannel, member: GuildMember) {
    const id = crypto.randomUUID();

    OnTranscriptionStart(id, voiceChannel, member);

    const mp3Path = await RecordVoiceToMP3(voiceChannel, member);
    const transcribedText = await CallWhisperCLI(mp3Path);

    OnTranscriptionUpdate(id, voiceChannel, {
        text: transcribedText
    });

    OnTranscriptionEnd(id, voiceChannel);
}