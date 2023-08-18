import { GuildMember, VoiceChannel } from "discord.js";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as prism from "prism-media";
import * as consts from "@cousinear/utils/consts";
import recordMemberStream from "@cousinear/utils/recordMemberStream";

import { STT_Client } from "..";

import OnTranscriptionStart from "@cousinear/handlers/OnTranscriptionStart";
import OnTranscriptionUpdate from "@cousinear/handlers/OnTranscriptionUpdate";
import OnTranscriptionEnd from "@cousinear/handlers/OnTranscriptionEnd";

const MicrosoftAzureSTT: STT_Client = (id: string, voiceChannel: VoiceChannel, member: GuildMember) => {

    if(!process.env.AZURE_SUBSCRIPTION_KEY || !process.env.AZURE_SERVICE_REGION) throw new Error("Invalid Microsoft Azure credentials");

    OnTranscriptionStart(id, voiceChannel, member);

    const opusStream = recordMemberStream(voiceChannel, member);

    const pcmStream = new prism.opus.Decoder({
        frameSize: consts.frameSize, 
        channels: consts.channels, 
        rate: consts.rate
    });

    const pushStream = sdk.AudioInputStream.createPushStream(
        sdk.AudioStreamFormat.getWaveFormatPCM(consts.rate, 16, consts.channels)
    );

    opusStream.pipe(pcmStream);
    pcmStream.on("data", chunk => pushStream.write(chunk));
    pcmStream.on("close", () => pushStream.close());

    const speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(process.env.AZURE_SUBSCRIPTION_KEY, process.env.AZURE_SERVICE_REGION);
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

    speechTranslationConfig.speechRecognitionLanguage = "pt-BR";

    const speechRecognizer = new sdk.SpeechRecognizer(speechTranslationConfig, audioConfig);
    
    speechRecognizer.recognizing = (sender, event) => {
        OnTranscriptionUpdate(id, voiceChannel, {
            text: event.result.text
        });
    };

    speechRecognizer.canceled = (sender, event) => {    
        speechRecognizer.stopContinuousRecognitionAsync();
        OnTranscriptionEnd(id, voiceChannel);
        throw new Error(`Error while processing audio: ${event.reason}`);
    };

    speechRecognizer.sessionStopped = () => {    
        speechRecognizer.stopContinuousRecognitionAsync();
        OnTranscriptionEnd(id, voiceChannel);
    };

    speechRecognizer.recognized = () => {
        OnTranscriptionEnd(id, voiceChannel);
    };
    
    speechRecognizer.startContinuousRecognitionAsync();
};

export default MicrosoftAzureSTT;