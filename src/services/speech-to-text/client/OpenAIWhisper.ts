import { GuildMember } from "discord.js";
import { AllowedTypeChannels } from "@cousinear/types";

import { RecordVoiceToMP3 } from "@cousinear/methods/RecordVoiceToMP3";
import CallOpenAIWhisper from "@cousinear/methods/CallOpenAIWhisper";

import OnTranscriptionStart from "@cousinear/events/OnTranscriptionStart";
import OnTranscriptionUpdate from "@cousinear/events/OnTranscriptionUpdate";
import OnTranscriptionEnd from "@cousinear/events/OnTranscriptionEnd";

import { STT_Client } from "..";

const OpenAIWhisper: STT_Client = async (id: string, voiceChannel: AllowedTypeChannels, member: GuildMember) => {
    OnTranscriptionStart(id, voiceChannel, member);

    const mp3Path = await RecordVoiceToMP3(voiceChannel, member);
    const transcribedText = await CallOpenAIWhisper(mp3Path);

    OnTranscriptionUpdate(id, voiceChannel, {
        text: transcribedText
    });

    OnTranscriptionEnd(id, voiceChannel);
};

export default OpenAIWhisper;