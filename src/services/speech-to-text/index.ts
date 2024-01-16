import { GuildMember } from "discord.js";
import WhisperCLI from "./client/WhisperCLI";
import OpenAIWhisper from "./client/OpenAIWhisper";
import MicrosoftAzureSTT from "./client/MicrosoftAzureSTT";
import { AllowedTypeChannels } from "@cousinear/types";
import MicrosoftAzureSTTwithTranslation from "./client/MicrosoftAzureSTT_translation";

export type STT_Client = (id: string, voiceChannel: AllowedTypeChannels, member: GuildMember) => void;

const service = process.env.STT_SERVICE || "local_whisper";
console.log(`[Using ${service} as speech-to-text service]`);

const clients: { [key: string]: STT_Client } = {
    "local_whisper": WhisperCLI,
    "openai_whisper": OpenAIWhisper,
    "microsoft_azure": MicrosoftAzureSTT,
    "microsoft_azure_with_translation": MicrosoftAzureSTTwithTranslation,
};

export default clients[service] || clients["local_whisper"];