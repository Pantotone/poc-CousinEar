import { VoiceChannel, GuildMember } from "discord.js";

import { RecordVoiceToMP3 } from "@cousinear/methods/RecordVoiceToMP3";
import CallOpenAIWhisper from "@cousinear/methods/CallOpenAIWhisper";

import OnTranscriptionStart from "@cousinear/handlers/OnTranscriptionStart";
import OnTranscriptionUpdate from "@cousinear/handlers/OnTranscriptionUpdate";
import OnTranscriptionEnd from "@cousinear/handlers/OnTranscriptionEnd";

import { STT_Client } from "..";

const OpenAIWhisper: STT_Client = async (id: string, voiceChannel: VoiceChannel, member: GuildMember) => {
    OnTranscriptionStart(id, voiceChannel, member);

    const mp3Path = await RecordVoiceToMP3(voiceChannel, member);
    const transcribedText = await CallOpenAIWhisper(mp3Path);

    OnTranscriptionUpdate(id, voiceChannel, {
        text: transcribedText
    });

    OnTranscriptionEnd(id, voiceChannel);
};

export default OpenAIWhisper;