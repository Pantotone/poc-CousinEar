import { AllowedTypeChannels } from "@cousinear/types";
import { websocket } from "..";
import { TranscriptionUpdate } from "@cousinear/events/OnTranscriptionUpdate";

export default function UpdateTranscription(id: string, voiceChannel: AllowedTypeChannels, update: TranscriptionUpdate) {
    websocket.sendToRoom(voiceChannel.id, "UpdateTranscription", {
        id,
        ...update
    });
}