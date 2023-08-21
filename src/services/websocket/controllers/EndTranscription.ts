import { websocket } from "..";
import { AllowedTypeChannels } from "@cousinear/types";

export default function EndTranscription(id: string, voiceChannel: AllowedTypeChannels) {
    websocket.sendToRoom(voiceChannel.id, "EndTranscription", {
        id
    });
}