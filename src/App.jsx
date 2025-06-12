import React, { useState, useEffect } from 'react'
import { useVoice } from './useVoice'

const SYSTEM_PROMPT = "You are Nova, a friendly and empathetic AI assistant who is helpful, encouraging, and uplifting."

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { speak, listen, stopListening, listening } = useVoice()

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages, userMessage],
  }),
})

// Handle OpenAI errors like 429, 401, etc.
if (!response.ok) {
  const errorText = await response.text()
  console.error("OpenAI API error:", errorText)
  setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I’m having trouble right now. Please try again in a few moments." }])
  return
}

const data = await response.json()
if (!data.choices || !data.choices[0]) {
  setMessages(prev => [...prev, { role: 'assistant', content: "Oops, I didn’t get that. Try again?" }])
  return
}

const botMessage = data.choices[0].message
setMessages(prev => [...prev, botMessage])
speak(botMessage.content)

    setMessages(prev => [...prev, botMessage])
    speak(botMessage.content)
  }

  const handleVoiceInput = async () => {
    setIsSpeaking(true)
    const result = await listen()
    setInput(result)
    setIsSpeaking(false)
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nova Assistant</h1>
      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block bg-white dark:bg-gray-700 px-4 py-2 rounded">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={handleVoiceInput} className="px-4 py-2 bg-indigo-600 text-white rounded">
          🎤 {listening ? 'Listening...' : 'Speak'}
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded border"
          placeholder="Type a message"
        />
        <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  )
}

export default App
