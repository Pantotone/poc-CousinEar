import { joinVoiceChannel } from "@discordjs/voice";
import { Client } from "discord.js";
import { onMemberSpeaking } from "@cousinear/events/OnMemberSpeaking";
import { IsValidChannel } from "@cousinear/utils/checks";

export async function OnReady(client: Client<true>) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const channel = process.env.DISCORD_TEST_VOICECHANNEL_ID ? await client.channels.fetch(process.env.DISCORD_TEST_VOICECHANNEL_ID) : null;

    if(IsValidChannel(channel)) {
        const voiceConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });

        voiceConnection.receiver.speaking.on("start", userId => {
            const member = channel.members.get(userId);
            if(!member) return;

            onMemberSpeaking(channel, member);
        });
    }
}