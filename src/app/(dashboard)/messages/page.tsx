'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, User, Search } from 'lucide-react'
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

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMessages() {
      setLoading(true)
      try {
        const result = await fetchRecentMessages('counselor')
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
    if (!newMessage.trim() || !recipient.trim()) return

    try {
      await sendMessage({
        content: newMessage,
        recipient: recipient,
        senderId: 'counselor',
      })
      setNewMessage('')
      setRecipient('')
      // Reload messages
      const result = await fetchRecentMessages('counselor')
      setMessages(result.data as Message[])
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with your students</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">No messages yet</div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-lg border p-4 ${
                      message.type === 'received' ? 'bg-muted/50' : 'bg-primary/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium">{message.sender}</span>
                          <span className="text-muted-foreground text-xs">{message.timestamp}</span>
                        </div>
                        <p className="mt-1 text-sm">{message.content}</p>
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
            <CardTitle>Send New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipient</label>
                <Input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter student name or ID"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="mt-1"
                  rows={4}
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
