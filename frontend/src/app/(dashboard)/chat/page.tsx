'use client'

import { useState, useRef, useEffect } from 'react'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { 
  Send, 
  Bot, 
  User,
  Paperclip,
  Mic,
  Smile,
  MoreHorizontal,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  FileText,
  HelpCircle
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  attachments?: Array<{ name: string; size: string }>
  reactions?: { thumbsUp: boolean; thumbsDown: boolean }
}

const suggestedTopics = [
  { icon: <Brain className="w-4 h-4" />, text: "Welche KI-Lösung passt zu meinem Unternehmen?" },
  { icon: <Target className="w-4 h-4" />, text: "ROI-Berechnung für KI-Projekte" },
  { icon: <TrendingUp className="w-4 h-4" />, text: "Best Practices für KI-Implementation" },
  { icon: <FileText className="w-4 h-4" />, text: "Compliance und Datenschutz bei KI" }
]

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hallo! Ich bin Ihr KI-Berater. Wie kann ich Ihnen heute bei Ihrer KI-Strategie helfen? 🤖',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '2',
    content: 'Hi! Ich würde gerne wissen, welche KI-Lösungen für den Kundenservice in einem mittelständischen E-Commerce Unternehmen sinnvoll wären.',
    sender: 'user',
    timestamp: new Date(Date.now() - 50000),
  },
  {
    id: '3',
    content: 'Ausgezeichnete Frage! Für mittelständische E-Commerce Unternehmen gibt es mehrere vielversprechende KI-Lösungen im Kundenservice:\n\n**1. Chatbots & Virtual Assistants** 🤖\n- 24/7 Verfügbarkeit für Standardanfragen\n- Sofortantworten zu Bestellstatus, Retouren, FAQ\n- Kostenreduktion um 30-40%\n\n**2. Sentiment Analysis** 📊\n- Automatische Erkennung unzufriedener Kunden\n- Priorisierung dringender Anfragen\n- Proaktive Problemlösung\n\n**3. Intelligente Ticket-Routing** 🎯\n- Automatische Kategorisierung von Anfragen\n- Weiterleitung an passende Experten\n- Reduzierte Bearbeitungszeit\n\n**4. Personalisierte Produktempfehlungen** 💡\n- KI-basierte Kaufberatung im Chat\n- Cross-Selling Möglichkeiten\n- Höhere Kundenzufriedenheit\n\nWelcher Bereich interessiert Sie besonders? Ich kann Ihnen gerne konkrete Implementierungsvorschläge machen.',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 40000),
    reactions: { thumbsUp: true, thumbsDown: false }
  }
]

export default function ChatPage() {
  const styles = useNotionStyles()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Vielen Dank für Ihre Nachricht! Ich analysiere gerade Ihre Anfrage und bereite eine detaillierte Antwort vor...',
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReaction = (messageId: string, type: 'thumbsUp' | 'thumbsDown') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: {
            thumbsUp: type === 'thumbsUp' ? !msg.reactions?.thumbsUp : false,
            thumbsDown: type === 'thumbsDown' ? !msg.reactions?.thumbsDown : false
          }
        }
      }
      return msg
    }))
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    // Show toast notification in real app
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar with Context */}
      <div className="w-80 border-r border-notion-border dark:border-notion-dark-border p-6 hidden lg:block">
        <div className="space-y-6">
          {/* Current Plan Info */}
          <NotionCard>
            <h3 className="font-semibold mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-notion-purple" />
              Ihr Plan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-notion-text-secondary">Plan:</span>
                <span className="font-medium">Professional</span>
              </div>
              <div className="flex justify-between">
                <span className="text-notion-text-secondary">Beratungsstunden:</span>
                <span className="font-medium">8/10 verfügbar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-notion-text-secondary">Antwortzeit:</span>
                <span className="font-medium text-notion-green">&lt; 2 Stunden</span>
              </div>
            </div>
          </NotionCard>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">Schnellzugriff</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors flex items-center">
                <Download className="w-4 h-4 mr-3 text-notion-text-secondary" />
                <span className="text-sm">Chat-Verlauf exportieren</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors flex items-center">
                <RefreshCw className="w-4 h-4 mr-3 text-notion-text-secondary" />
                <span className="text-sm">Neues Gespräch starten</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors flex items-center">
                <HelpCircle className="w-4 h-4 mr-3 text-notion-text-secondary" />
                <span className="text-sm">Hilfe & FAQ</span>
              </button>
            </div>
          </div>

          {/* Suggested Topics */}
          <div>
            <h3 className="font-semibold mb-3">Themenvorschläge</h3>
            <div className="space-y-2">
              {suggestedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(topic.text)}
                  className="w-full text-left p-3 rounded-lg border border-notion-border dark:border-notion-dark-border hover:border-notion-blue transition-colors flex items-start group"
                >
                  <span className="text-notion-blue mr-3 mt-0.5 group-hover:scale-110 transition-transform">
                    {topic.icon}
                  </span>
                  <span className="text-sm">{topic.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-notion-border dark:border-notion-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-notion-blue to-notion-purple rounded-full flex items-center justify-center mr-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">KI-Berater</h2>
                <p className="text-xs text-notion-green flex items-center">
                  <span className="w-2 h-2 bg-notion-green rounded-full mr-1 animate-pulse"></span>
                  Online - Durchschnittliche Antwortzeit: 30 Sek
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-notion-blue text-white' 
                        : 'bg-gradient-to-br from-notion-blue to-notion-purple text-white'
                    }`}>
                      {message.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <div className={`p-4 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-notion-blue text-white'
                        : 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Attachments */}
                      {message.attachments && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center p-2 bg-black/10 rounded">
                              <Paperclip className="w-4 h-4 mr-2" />
                              <span className="text-sm">{attachment.name}</span>
                              <span className="text-xs ml-auto opacity-70">{attachment.size}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message Footer */}
                    <div className="flex items-center mt-2 space-x-3">
                      <span className="text-xs text-notion-text-secondary">
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {message.sender === 'assistant' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(message.content)}
                            className="p-1 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded transition-colors"
                            title="Kopieren"
                          >
                            <Copy className="w-3 h-3 text-notion-text-secondary" />
                          </button>
                          <button
                            onClick={() => handleReaction(message.id, 'thumbsUp')}
                            className={`p-1 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded transition-colors ${
                              message.reactions?.thumbsUp ? 'text-notion-green' : 'text-notion-text-secondary'
                            }`}
                            title="Hilfreich"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleReaction(message.id, 'thumbsDown')}
                            className={`p-1 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded transition-colors ${
                              message.reactions?.thumbsDown ? 'text-notion-red' : 'text-notion-text-secondary'
                            }`}
                            title="Nicht hilfreich"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 p-4 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-notion-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-notion-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-notion-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-notion-text-secondary">KI-Berater schreibt...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-notion-border dark:border-notion-dark-border p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              {/* Attachment Button */}
              <button className="p-2 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-notion-text-secondary" />
              </button>

              {/* Input Field */}
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Stellen Sie Ihre Frage zur KI-Implementation..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-notion-border dark:border-notion-dark-border rounded-lg bg-notion-bg dark:bg-notion-dark-bg resize-none focus:outline-none focus:ring-2 focus:ring-notion-blue focus:border-transparent"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                {/* Emoji Button */}
                <button className="absolute right-3 bottom-3 p-1 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded transition-colors">
                  <Smile className="w-5 h-5 text-notion-text-secondary" />
                </button>
              </div>

              {/* Voice Button */}
              <button className="p-2 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded-lg transition-colors">
                <Mic className="w-5 h-5 text-notion-text-secondary" />
              </button>

              {/* Send Button */}
              <NotionButton
                variant="primary"
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-4"
              >
                <Send className="w-5 h-5" />
              </NotionButton>
            </div>

            {/* Input Helper */}
            <p className="text-xs text-notion-text-secondary mt-2">
              Drücken Sie Enter zum Senden, Shift+Enter für neue Zeile
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}