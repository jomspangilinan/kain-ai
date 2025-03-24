import { useState, useRef, useEffect } from 'react'
import { AzureOpenAI } from 'openai'
import ReactMarkdown from 'react-markdown'

type Message = {
  sender: 'user' | 'bot'
  text: string
  image?: string // Optional image URL for messages
}

type MealDetails = {
  description: string
  dish: string
  per100grams: {
    calories: string
    protein: string
    fat: string
    carbohydrates: string
  }
  ingredientsBreakdown: Record<
    string,
    {
      calories: string
      protein: string
      fat: string
      carbohydrates: string
    }
  >
  note: string
}

// Load environment variables
const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT
const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY
const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID
const apiVersion = "2024-05-01-preview"

if (!endpoint || !apiKey || !deployment) {
  throw new Error("Missing Azure OpenAI configuration in environment variables.")
}

const openAiClient = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true })


// Get Azure SDK client
const getClient = () => {
    const assistantsClient = new AzureOpenAI({
      endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT_ASSISTANT,
      apiVersion: apiVersion,
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    return assistantsClient;
  };
const assistantsClient = getClient();

export default function ChatBotV2() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState<boolean>(false) // Typing animation state
  const [mealDetails, setMealDetails] = useState<MealDetails | null>(null) // Store meal details
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  
  const sendMessage = async () => {
    if (!input.trim() && !imagePreview) return

    const newMessage: Message = { sender: 'user', text: input, image: imagePreview || undefined }
    setMessages((prev) => [...prev, newMessage])
    setInput('')
    setImagePreview(null)

    setIsTyping(true) // Show typing animation
    try {
        const payload: any = {
            messages: [
              { role: 'system', content: 'You are a nutritionist. You need to breakdown the ingredients calories and macros of all the food I will be sending to you using Filipino food exchange list. Start with what food is it? Then you break it down per 100 grams, you should specify the per 100 grams.' },
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
            const base64Image = await convertBlobToBase64(blob) // Convert the image to base64
            payload.messages[1].content.push({
              type: 'image_url',
              image_url: {
                url: base64Image, // Include the base64-encoded image in the payload
              },
            })
          }
    
          console.log('Payload:', payload)

      const completion = await openAiClient.chat.completions.create({
        model: 'gpt-4o-2024-05-13',
        ...payload,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
      })

      const botReply = completion.choices?.[0]?.message?.content?.trim() || 'I could not process your request.'
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }])

      // Parse meal details from the bot's response
      const parsedMealDetails = parseMealDetailsFromResponse(botReply)
      if (parsedMealDetails) {
        const mealDetailsResult = await parsedMealDetails
        setMealDetails(mealDetailsResult)
      }
    } catch (error) {
      console.error('Error communicating with Azure OpenAI:', error)
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Something went wrong. Please try again.' }])
    } finally {
      setIsTyping(false) // Hide typing animation
    }
  }

  const parseMealDetailsFromResponse = async (botResponse: string): Promise<MealDetails | null> => {
    try {
      const thread = await assistantsClient.beta.threads.create({})
  
      await assistantsClient.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: botResponse
      })
  
      const run = await assistantsClient.beta.threads.runs.create(thread.id, {
        assistant_id: 'asst_tcEhamx1wcvfk3crPJl6j1UX',
      })
  
      // Poll until complete
      let status = run.status
      while (status === 'queued' || status === 'in_progress') {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const runStatus = await assistantsClient.beta.threads.runs.retrieve(thread.id, run.id)
        status = runStatus.status
      }
  
      if (status !== 'completed') {
        console.warn('Run did not complete successfully:', status)
        return null
      }
  
      const messages = await assistantsClient.beta.threads.messages.list(thread.id)

      // 🧠 Find the assistant's response (not the user's message)
      const assistantMessage = messages.data.find((msg) => msg.role === 'assistant')

      console.log(assistantMessage)
      if (!assistantMessage) {
        console.warn('No assistant message found.')
        return null
      }
  
      const textBlock = assistantMessage.content.find((block) => block.type === 'text')

      const messageText = textBlock?.text?.value
      
      if (!messageText) return null
      console.log(messageText)
      const cleanJson = messageText.replace(/```(?:json)?|```/g, '').trim()
      return JSON.parse(cleanJson)
    } catch (err) {
      console.error('Error parsing with Assistant:', err)
      return null
    }
  }
  
  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      e.target.value = '' // Reset the file input value to allow re-uploading the same file
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
    <div className="flex h-screen bg-gray-100">
      {/* Centered Container with Margins */}
      <div className="container mx-auto my-6 bg-white rounded-lg shadow-lg flex overflow-hidden">
        {/* Sidebar for Meal Details */}
        <div className="w-1/3 bg-blue-50 border-r p-4 overflow-y-auto">
  <h2 className="text-2xl font-bold text-blue-600 mb-4">Meal Breakdown</h2>
  {mealDetails ? (
    <div className="space-y-4">
      {/* Dish Name */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{mealDetails.dish}</h3>
        <p className="text-sm text-gray-600">{mealDetails.description}</p>
      </div>

      {/* Per 100 Grams Breakdown */}
      <div>
        <h4 className="text-md font-bold text-gray-700 mb-2">Per 100 Grams:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>Calories:</strong> {mealDetails.per100grams.calories}</li>
          <li><strong>Protein:</strong> {mealDetails.per100grams.protein}</li>
          <li><strong>Fat:</strong> {mealDetails.per100grams.fat}</li>
          <li><strong>Carbohydrates:</strong> {mealDetails.per100grams.carbohydrates}</li>
        </ul>
      </div>

      {/* Ingredients Breakdown */}
      <div>
        <h4 className="text-md font-bold text-gray-700 mb-2">Ingredients Breakdown:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          {Object.entries(mealDetails.ingredientsBreakdown).map(([ingredient, details]) => (
            <li key={ingredient} className="border-b pb-2">
              <strong className="text-gray-800">{ingredient}:</strong>
              <ul className="ml-4 space-y-1">
                <li><strong>Calories:</strong> {details.calories}</li>
                <li><strong>Protein:</strong> {details.protein}</li>
                <li><strong>Fat:</strong> {details.fat}</li>
                <li><strong>Carbohydrates:</strong> {details.carbohydrates}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Note */}
      <div>
        <p className="text-xs text-gray-500 italic">{mealDetails.note}</p>
      </div>
    </div>
  ) : (
    <p className="text-gray-500">No meal details available. Ask the bot for a meal breakdown.</p>
  )}
</div>

        {/* ChatBot Section */}
        <div className="w-2/3 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 self-end ml-auto'
                    : 'bg-gray-200 self-start mr-auto'
                }`}
              >
                {msg.sender === 'bot' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
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
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-400"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPaste={handlePaste} // Handle pasted images
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
              Attach
            </label>
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Send
            </button>
          </div>

          {/* Attached Image Preview */}
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
      </div>
    </div>
  )
}