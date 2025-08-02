'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, User } from 'lucide-react'
import { fetchRecentMessages, sendMessage } from '@/shared/service/api'

interface Message {
  id: string
  sender: string
  senderId: string
  content: string
  timestamp: string
  read: boolean
  type: 'received' | 'sent'
}

export default function StudentMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMessages() {
      setLoading(true)
      try {
        const result = await fetchRecentMessages('student')
        setMessages(result.data as Message[])
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await sendMessage({
        content: newMessage,
        recipient: 'counselor',
        senderId: 'student',
      })
      setNewMessage('')
      // Reload messages
      const result = await fetchRecentMessages('student')
      setMessages(result.data as Message[])
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with your counselor</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Messages List */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                No messages yet. Start a conversation with your counselor!
              </div>
            ) : (
              <div className="max-h-[300px] space-y-4 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.type === 'sent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <span className="text-sm font-medium">{message.sender}</span>
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                          </div>
                          <p className="mt-1 text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Send Message */}
        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to your counselor..."
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
