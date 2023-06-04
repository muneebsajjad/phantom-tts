var sdk = require("microsoft-cognitiveservices-speech-sdk");
const { v4: uuidv4 } = require("uuid");
const { Command } = require("commander");

const SPEAKER = {
  MALE: "male",
  FEMALE: "female",
};

const LANGUAGE = {
  UR: "ur",
  EN: "en",
};

const program = new Command();
program
  .name("tts-util")
  .description("Text to speech utility utilities")
  .version("1.0.0");

program
  .command("tts")
  .description("Text to speech utility for various languages")
  .argument("<string>", "Text to be synthesized")
  .option("-s, --speaker <string>", "chose speaker", SPEAKER.FEMALE)
  .option("-l, --lang <string>", "chose language", LANGUAGE.UR)
  .action((text, options) => {
    let voiceName = "";
    // const limit = options.speaker ? 1 : undefined;
    if (options.lang === LANGUAGE.UR) {
      if (options.speaker === SPEAKER.MALE) {
        voiceName = "ur-PK-AsadNeural";
      }

      if (options.speaker === SPEAKER.FEMALE) {
        voiceName = "ur-PK-UzmaNeural";
      }
    }
    if (options.lang === LANGUAGE.EN) {
      if (options.speaker === SPEAKER.MALE) {
        voiceName = "en-GB-AlfieNeural";
      }
      if (options.speaker === SPEAKER.FEMALE) {
        voiceName = "en-GB-AbbiNeural";
      }
    }
    let audioFileName = `${options.lang}-${options.speaker}-${uuidv4()}.wav`;

    // console.log(">>>>>>>>>", options.speaker);
    // console.log(">>>>>>>>>", options.lang);
    // console.log(">>>>>>>>>", text);
    // console.log(">>>>>>>>>", audioFileName);

    if (!voiceName) {
      console.log("ops!! please chose the speaker.");
    }
    // ------------Start

    var audioFile = `./audio_output/${audioFileName}`;
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.SPEECH_KEY,
      process.env.SPEECH_REGION
    );
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = voiceName;

    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    // Start the synthesizer and wait for a result.
    synthesizer.speakTextAsync(
      text,
      function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
        } else {
          console.error(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you set the speech resource key and region values?"
          );
        }
        synthesizer.close();
        synthesizer = null;
      },
      function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        synthesizer = null;
      }
    );
    console.log("Now synthesizing to: " + audioFile);

    //------------
  });
program.parse();
