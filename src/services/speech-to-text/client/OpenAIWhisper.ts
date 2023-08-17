import { VoiceChannel, GuildMember } from "discord.js";
import { RecordVoiceToMP3 } from "../../../methods/RecordVoiceToMP3";
import OnTranscriptionStart from "../../../handlers/OnTranscriptionStart";
import OnTranscriptionUpdate from "../../../handlers/OnTranscriptionUpdate";
import OnTranscriptionEnd from "../../../handlers/OnTranscriptionEnd";
import { STT_Client } from "..";
import CallOpenAIWhisper from "../../../methods/CallOpenAIWhisper";

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