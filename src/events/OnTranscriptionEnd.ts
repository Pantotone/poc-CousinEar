import * as websocket from "@cousinear/services/websocket";
import { AllowedTypeChannels } from "@cousinear/types";

export default function OnTranscriptionEnd(id: string, voiceChannel: AllowedTypeChannels) {
    websocket.EndTranscription(id, voiceChannel);
}