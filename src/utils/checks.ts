import { AllowedTypeChannels } from "@cousinear/types";
import { Channel, StageChannel, VoiceChannel } from "discord.js";

export function IsValidChannel(channel: Channel | null): channel is AllowedTypeChannels {
    if(channel instanceof VoiceChannel) return true;
    if(channel instanceof StageChannel) return true;
    
    return false;
}