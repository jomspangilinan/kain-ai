import React from 'react';
import { useState, useRef, useEffect } from 'react'
import { AzureOpenAI } from 'openai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm' // <-- Import remarkGfm
import { FaPaperPlane } from 'react-icons/fa';
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosAttach } from "react-icons/io";

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
  sender: 'user' | 'bot'
  text: string
  image?: string // Optional image URL for messages
}

const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT
const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY
const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID
const apiVersion = "2024-05-01-preview"

const searchIndex = import.meta.env.VITE_AZURE_SEARCH_INDEX_NAME
const searchEndpoint = import.meta.env.VITE_AZURE_SEARCH_ENDPOINT
const searchKey = import.meta.env.VITE_AZURE_SEARCH_KEY

if (!endpoint || !apiKey || !deployment) {
  throw new Error("Missing Azure OpenAI configuration in environment variables.")
}

const openAiClient = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true })

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const sendMessage = async () => {
    if (!input.trim() && !imagePreview) return

    const newMessage: Message = { sender: 'user', text: input, image: imagePreview || undefined }
    setMessages((prev) => [...prev, newMessage])
    setInput('')
    setImagePreview(null)
    setIsTyping(true)

    try {
      const payload: any = {
        messages: [
          {
            role: 'system',
            content: `You are a nutritionist, and you are to determine or infer the Filipino food item (or a general term if it is not Filipino) from the user’s image or description.
Next, provide the combined grams and proximates of the food (per 100g basis), including:
Calories (kcal)
Protein (g)
Carbs (g)
Fats (g)
Offer a total suggested serving size in a measure that is easy to understand (e.g., per cup, per serving).
The chatbot should produce a concise table in this format (or a variant that includes the necessary details):
[Name of food] [Food per 100g ]
- Calories (kcal)
- Protein (g)
- Carbs (g)
- Fats (g)
If the item is not definitively Filipino, simply return a general term for the dish or ingredient.

Tell the user, you've added it to the food log diary, and can check the breakdown there.
            `
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: input || 'This is my meal, breakdown for me for food log.' },
            ],
          },
        ],
        max_tokens: 2000,
      }
      if (imagePreview) {
        const response = await fetch(imagePreview)
        const blob = await response.blob()
        const base64Image = await convertBlobToBase64(blob)
        payload.messages[1].content.push({
          type: 'image_url',
          image_url: {
            url: base64Image,
          },
        })
      }

      const completion = await openAiClient.chat.completions.create({
        model: 'gpt-4o-2024-05-13',
        ...payload,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null
      })

      const botReply = completion.choices?.[0]?.message?.content?.trim() || 'I could not process your request.'
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }])
    } catch (error) {
      console.error('Error communicating with Azure OpenAI:', error)
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Something went wrong. Please try again.' }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      e.target.value = ''
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          const imageUrl = URL.createObjectURL(file)
          setImagePreview(imageUrl)
        }
      }
    }
  }

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className={`fixed inset-0 bg-white z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
      {/* Header */}
      <div className="p-4 bg-green-600 text-white flex items-center justify-between">
        <h2 className="text-lg font-bold">Chat with Kali</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <AiFillCloseCircle size={24} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${msg.sender === 'user'
              ? 'bg-green-600 text-white self-end ml-auto'
              : 'bg-gray-200 text-gray-700 self-start mr-auto'
              }`}
          >
            {msg.sender === 'bot' ? (
              // Use the remarkGfm plugin to render tables, strikethrough, etc.
              <div className="markdown break-words overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            ) : (
              msg.text
            )}
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded"
                className="mt-2 rounded-lg max-w-full"
              />
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="typing-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Type your meal or ask something..."
          className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-300"
        >
          <IoIosAttach className="text-2xl" />
        </label>
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 flex items-center gap-2"
        >
          <FaPaperPlane />
          <span>Send</span>
        </button>
      </div>

      {imagePreview && (
        <div className="p-3 border-t bg-gray-100 flex items-center gap-2">
          <span className="text-sm text-gray-600">Attached Image:</span>
          <img
            src={imagePreview}
            alt="Preview"
            className="w-12 h-12 rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  )
}

export default Chatbot;
