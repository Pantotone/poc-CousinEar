
import { AllowedTypeChannels } from "@cousinear/types";
import { AudioReceiveStream, EndBehaviorType, getVoiceConnection } from "@discordjs/voice";
import { GuildMember } from "discord.js";

export const currentStreams = new Map<string, AudioReceiveStream>();

export default function recordMemberStream(channel: AllowedTypeChannels, member: GuildMember) {
    const connection = getVoiceConnection(channel.guildId);
    if(!connection) throw new Error("Bot isn't currently on specified Voice Channel");

    const opusStream = connection.receiver.subscribe(member.id, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 1000
        }
    });

    currentStreams.set(member.id, opusStream);

    return opusStream;
}