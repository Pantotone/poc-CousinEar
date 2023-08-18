import { VoiceChannel, GuildMember } from "discord.js";

import { RecordVoiceToMP3 } from "@cousinear/methods/RecordVoiceToMP3";
import CallWhisperCLI from "@cousinear/methods/CallWhisperCLI";

import OnTranscriptionStart from "@cousinear/events/OnTranscriptionStart";
import OnTranscriptionUpdate from "@cousinear/events/OnTranscriptionUpdate";
import OnTranscriptionEnd from "@cousinear/events/OnTranscriptionEnd";

import { STT_Client } from "..";

const WhisperCLI: STT_Client = async (id: string, voiceChannel: VoiceChannel, member: GuildMember) => {
    OnTranscriptionStart(id, voiceChannel, member);

    const mp3Path = await RecordVoiceToMP3(voiceChannel, member);
    const transcribedText = await CallWhisperCLI(mp3Path);

    OnTranscriptionUpdate(id, voiceChannel, {
        text: transcribedText
    });

    OnTranscriptionEnd(id, voiceChannel);
};

export default WhisperCLI;