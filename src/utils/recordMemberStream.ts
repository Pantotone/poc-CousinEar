
import { EndBehaviorType, getVoiceConnection } from "@discordjs/voice";
import { GuildMember, VoiceChannel } from "discord.js";

export default function recordMemberStream(channel: VoiceChannel, member: GuildMember) {
    const connection = getVoiceConnection(channel.guildId);
    if(!connection) throw new Error("Bot isn't currently on specified Voice Channel");

    const opusStream = connection.receiver.subscribe(member.id, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 1000
        }
    });

    return opusStream;
}