import { VoiceChannel, GuildMember } from "discord.js";
import { RecordVoiceToMP3 } from "../../../methods/RecordVoiceToMP3";
import CallWhisperCLI from "../../../methods/CallWhisperCLI";
import OnTranscriptionStart from "../../../handlers/OnTranscriptionStart";
import OnTranscriptionUpdate from "../../../handlers/OnTranscriptionUpdate";
import OnTranscriptionEnd from "../../../handlers/OnTranscriptionEnd";
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