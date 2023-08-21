import { GuildMember } from "discord.js";
import crypto from "node:crypto";
import processSpeak from "@cousinear/services/speech-to-text";
import { currentStreams } from "@cousinear/utils/recordMemberStream";
import { AllowedTypeChannels } from "@cousinear/types";

export async function onMemberSpeaking(voiceChannel: AllowedTypeChannels, member: GuildMember) {
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