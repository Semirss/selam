"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, ShieldOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  sessionId?: string;
  locale: string;
  anonymous?: boolean;
  onAnonymousToggle?: (val: boolean) => void;
}

export function ChatInterface({ sessionId, locale, anonymous = false, onAnonymousToggle }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(anonymous);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleAnonymous = () => {
    const next = !isAnonymous;
    setIsAnonymous(next);
    onAnonymousToggle?.(next);
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    // Add streaming assistant placeholder
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, locale, anonymous: isAnonymous }),
      });

      if (!res.body) throw new Error('No stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: accumulated }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Anonymous Toggle */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-gray">Talk to Selam AI</p>
        <button
          onClick={toggleAnonymous}
          className={cn(
            'flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors',
            isAnonymous
              ? 'border-warning text-warning bg-orange-50'
              : 'border-gray-light text-gray hover:border-navy'
          )}
        >
          {isAnonymous ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
          {isAnonymous ? 'Anonymous Mode ON' : 'Anonymous Mode OFF'}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
            <div className="h-14 w-14 rounded-full bg-teal-light flex items-center justify-center">
              <Bot className="h-7 w-7 text-teal" />
            </div>
            <p className="text-gray text-sm">
              Hi, I&apos;m Selam. How are you feeling today?
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              <div className={cn(
                'h-8 w-8 rounded-full shrink-0 flex items-center justify-center',
                msg.role === 'user' ? 'bg-teal' : 'bg-navy'
              )}>
                {msg.role === 'user'
                  ? <User className="h-4 w-4 text-white" />
                  : <Bot className="h-4 w-4 text-white" />}
              </div>
              <div className={cn(
                'max-w-[75%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-teal text-white rounded-tr-none'
                  : 'bg-white border border-gray-light text-dark rounded-tl-none shadow-sm'
              )}>
                {msg.content || (isStreaming && i === messages.length - 1
                  ? <span className="flex gap-1">
                      <span className="animate-bounce delay-0">•</span>
                      <span className="animate-bounce delay-75">•</span>
                      <span className="animate-bounce delay-150">•</span>
                    </span>
                  : '')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 h-11 px-4 rounded-md border border-gray-light text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          disabled={isStreaming}
        />
        <Button
          onClick={sendMessage}
          isLoading={isStreaming}
          size="sm"
          className="shrink-0 h-11 w-11 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
