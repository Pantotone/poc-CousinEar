import { GuildMember } from "discord.js";
import { websocket } from "..";
import { AllowedTypeChannels } from "@cousinear/types";

export default function NewTranscription(id: string, voiceChannel: AllowedTypeChannels, member: GuildMember) {
    const startTime = Date.now();

    websocket.sendToRoom(voiceChannel.id, "NewTranscription", {
        id,
        member: {
            name: member.displayName,
            avatar: member.displayAvatarURL(),
            color: member.user.hexAccentColor
        },
        startTime
    });
}