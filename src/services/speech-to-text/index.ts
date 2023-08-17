import { GuildMember, VoiceChannel } from "discord.js";
import WhisperCLI from "./client/WhisperCLI";
import OpenAIWhisper from "./client/OpenAIWhisper";

export type STT_Client = (id: string, voiceChannel: VoiceChannel, member: GuildMember) => void;

const service = process.env.STT_SERVICE || "local_whisper";
console.log(`[Using ${service} as speech-to-text service]`);

const clients: { [key: string]: STT_Client } = {
    "local_whisper": WhisperCLI,
    "openai_whisper": OpenAIWhisper
};

export default clients[service] || clients["local_whisper"];