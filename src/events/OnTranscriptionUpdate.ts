import * as websocket from "@cousinear/services/websocket";
import { AllowedTypeChannels } from "@cousinear/types";

export interface TranscriptionUpdate {
    text: string;
}

export default function OnTranscriptionUpdate(id: string, voiceChannel: AllowedTypeChannels, update: TranscriptionUpdate) {
    websocket.UpdateTranscription(id, voiceChannel, update);
}