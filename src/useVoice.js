export function useVoice() {
  const synth = window.speechSynthesis
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognizer = recognition ? new recognition() : null
  recognizer && (recognizer.lang = 'en-US')

  const speak = (text, voiceName = 'Nova') => {
    const utter = new SpeechSynthesisUtterance(text)
    const voices = synth.getVoices()
    const voice = voices.find(v => v.name.includes(voiceName)) || voices[0]
    utter.voice = voice
    synth.speak(utter)
  }

  const listen = () =>
    new Promise(resolve => {
      if (!recognizer) return resolve('')
      recognizer.start()
      recognizer.onresult = e => {
        recognizer.stop()
        resolve(e.results[0][0].transcript)
      }
    })

  return {
    speak,
    listen,
    stopListening: () => recognizer?.stop(),
    listening: false,
  }
}
