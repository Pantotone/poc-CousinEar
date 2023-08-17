import { GuildMember, VoiceChannel } from "discord.js";
import { websocket } from "..";

export default function NewTranscription(id: string, voiceChannel: VoiceChannel, member: GuildMember) {
    const startTime = Date.now();

    websocket.sendToRoom(voiceChannel.id, "NewTranscription", {
        id,
        member: {
            name: member.displayName,
            avatar: member.avatarURL
        },
        startTime
    });
}