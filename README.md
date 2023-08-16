## Cousin*ear*

A proof-of-concept of a Discord bot able to connect into a voice channel, strip down each voice data, and run through a speech-to-text converter.

### Currently using:
- [OpenAI's Whisper model](https://github.com/openai/whisper) for speech-to-text conversion
- [whisper-ctranslate2](https://github.com/Softcatala/whisper-ctranslate2) as interface to Whisper (run on cli, faster output)
- [Discord.js](https://discord.js.org) as a Discord interface
- [prism-media](https://github.com/amishshah/prism-media) for media conversion (opus to pcm)
- [ffmpeg](https://www.ffmpeg.org/) to process audio (pcm to mp3)
