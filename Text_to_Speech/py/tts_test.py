import pyttsx3
import pyopenjtalk
import numpy as np
import soundfile as sf


def text_to_speech(text, language):
    if language == "English":
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()
    elif language == "Japanese":
        x, sr = pyopenjtalk.tts(text)
        sf.write("output.wav", x, sr, "PCM_24")


text_to_speech("Hello, I am an AI.", "English")
text_to_speech("こんにちは、私はジャービスです。", "Japanese")
