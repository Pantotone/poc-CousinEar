import { GuildMember, VoiceChannel } from "discord.js";
import crypto from "node:crypto";
import processSpeak from "@cousinear/services/speech-to-text";
import { currentStreams } from "@cousinear/utils/recordMemberStream";

export async function onMemberSpeaking(voiceChannel: VoiceChannel, member: GuildMember) {
    if(member.user.bot) return;

    const currentStream = currentStreams.get(member.id);

    if(currentStream) {
        currentStream.emit("end");
        currentStream.emit("close");
        currentStream.destroy();
    }

    const id = crypto.randomUUID();
    processSpeak(id, voiceChannel, member);
}