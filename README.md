## Cousin*ear*

A proof-of-concept of a Discord bot able to connect into a voice channel, strip down each voice data, and run through a speech-to-text converter.

### Currently using:
- Speech-to-text services available:
    - (local, free) [OpenAI's Whisper model](https://github.com/openai/whisper) - (run on cli)
    - (local, free) [whisper-ctranslate2](https://github.com/Softcatala/whisper-ctranslate2) as interface to Whisper - (run on cli, faster output than original whisper)
    - (remote, paid) [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
    - (remote, paid - with free tier) [Microsoft Azure STT AI](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text) - (allow real-time decoding, fastest, but not as accurate)
- [Discord.js](https://discord.js.org) as a Discord interface
- (for local use) [prism-media](https://github.com/amishshah/prism-media) for media conversion (opus to pcm)
- (for local use) [ffmpeg](https://www.ffmpeg.org/) to process audio (pcm to mp3)
