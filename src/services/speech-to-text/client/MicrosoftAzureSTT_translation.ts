import { GuildMember } from "discord.js";
import { AllowedTypeChannels } from "@cousinear/types";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as prism from "prism-media";
import * as consts from "@cousinear/utils/consts";
import recordMemberStream from "@cousinear/utils/recordMemberStream";

import { STT_Client } from "..";

import OnTranscriptionStart from "@cousinear/events/OnTranscriptionStart";
import OnTranscriptionUpdate from "@cousinear/events/OnTranscriptionUpdate";
import OnTranscriptionEnd from "@cousinear/events/OnTranscriptionEnd";


const MicrosoftAzureSTTwithTranslation: STT_Client = (id: string, voiceChannel: AllowedTypeChannels, member: GuildMember) => {

    if(!process.env.AZURE_SUBSCRIPTION_KEY || !process.env.AZURE_SERVICE_REGION) throw new Error("Invalid Microsoft Azure credentials");

    OnTranscriptionStart(id, voiceChannel, member);

    /**
     * Audio treatment section
     */

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


    /**
     * Speech-to-text configuration section
     */

    const speechConfig = sdk.SpeechTranslationConfig.fromSubscription(process.env.AZURE_SUBSCRIPTION_KEY, process.env.AZURE_SERVICE_REGION);
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.addTargetLanguage("pt-BR");
    speechConfig.addTargetLanguage("en-US");

    speechConfig.enableDictation();
    speechConfig.setProfanity(sdk.ProfanityOption.Raw);
    
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const autoDetectSourceLanguageConfig = sdk.AutoDetectSourceLanguageConfig.fromLanguages(["pt-BR", "en-US"]);

    const speechRecognizer = sdk.TranslationRecognizer.FromConfig(speechConfig, autoDetectSourceLanguageConfig, audioConfig);
    

    /**
     * Events section
     */

    speechRecognizer.recognizing = (sender, event) => {
        OnTranscriptionUpdate(id, voiceChannel, {
            text: event.result.text,
            translations: {
                "en-US": event.result.translations.get("en-US", event.result.text),
                "pt-BR": event.result.translations.get("pt-BR", event.result.text),
            }
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

    speechRecognizer.recognized = (sender, event) => {
        OnTranscriptionUpdate(id, voiceChannel, {
            text: event.result.text,
            translations: {
                "en-US": event.result.translations.get("en-US", event.result.text),
                "pt-BR": event.result.translations.get("pt-BR", event.result.text),
            }
        });
        OnTranscriptionEnd(id, voiceChannel);
    };
    
    speechRecognizer.startContinuousRecognitionAsync();
};

export default MicrosoftAzureSTTwithTranslation;