import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { getInitialMessages, getAssistantReply } from '../../data/assistantData';
import { useTheme } from '../../contexts/ThemeContext';
import { useReducedMotion } from '../../hooks/useMediaQueries';

/* Formats assistant text lightly: **bold** → <strong> */
function formatText(text) {
  const parts = text.split('**');
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>));
}

function MessageBubble({ message }) {
  const isUser = message.from === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center border ${
            isUser ? 'bg-accent/15 border-accent/30 text-accent' : 'bg-surface-light border-foreground/10 text-accent'
          }`}
          aria-hidden="true"
        >
          {isUser ? <User size={13} /> : <Bot size={13} />}
        </div>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap break-words shadow-lg ${
            isUser
              ? 'bg-accent text-white rounded-br-sm border border-accent/60'
              : 'bg-surface border border-foreground/[0.08] text-foreground rounded-bl-sm'
          }`}
        >
          {formatText(message.text)}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center border border-foreground/10 bg-surface-light text-accent" aria-hidden="true">
        <Bot size={13} />
      </div>
      <div className="px-3.5 py-3 rounded-2xl bg-surface border border-foreground/[0.08] flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">Assistant is typing</span>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => getInitialMessages());
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { accentKey } = useTheme();

  /* Reset the chat when the accent changes so bubble
     styling always matches the global theme accent. */
  useEffect(() => {
    setMessages(getInitialMessages());
    setError(null);
    setIsTyping(false);
  }, [accentKey]);

  /* Auto-scroll to newest message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  /* Focus input when opened */
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => textareaRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;
      setError(null);
      setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: trimmed }]);
      setInput('');
      setIsTyping(true);
      try {
        getAssistantReply(trimmed, (reply) => {
          setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'assistant', text: reply }]);
          setIsTyping(false);
        });
      } catch (err) {
        console.error('Assistant error:', err);
        setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'assistant', text: 'Something went wrong. Please try again.' }]);
        setError('A problem occurred while replying.');
        setIsTyping(false);
      }
    },
    [isTyping]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = useCallback(() => {
    setMessages(getInitialMessages());
    setInput('');
    setError(null);
    setIsTyping(false);
  }, []);

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
        {!isOpen && (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Open AI portfolio assistant"
            data-cursor
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent text-white shadow-[0_0_25px_var(--accent-glow)] border border-white/20"
          >
            <span className="absolute inset-0 rounded-full bg-accent opacity-30 animate-ping [animation-duration:2.5s] pointer-events-none" aria-hidden="true" style={reducedMotion ? { animation: 'none' } : undefined} />
            <motion.span
              animate={reducedMotion ? {} : { rotate: [0, 12, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="block"
              aria-hidden="true"
            >
              <Sparkles size={22} className="sm:hidden" />
              <Sparkles size={26} className="hidden sm:block" />
            </motion.span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" aria-hidden="true" />
          </motion.button>
        )}
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            role="dialog"
            aria-label="AI portfolio assistant chat"
            className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-15 w-auto sm:w-[400px] z-[60]"
          >
            <div className="relative overflow-hidden rounded-3xl border border-foreground/[0.1] bg-background/90 backdrop-blur-2xl shadow-2xl">
              {/* Top glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" aria-hidden="true" />

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-foreground/[0.08] bg-surface/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">Portfolio Assistant</p>
                    <p className="flex items-center gap-1.5 text-[11px] text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                      Online · Ask about Aman
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={resetChat} aria-label="Reset conversation" title="Reset conversation" className="p-2 rounded-lg text-muted hover:text-accent hover:bg-surface-light transition-colors">
                    <RefreshCw size={15} />
                  </button>
                  <button type="button" onClick={() => setIsOpen(false)} aria-label="Close AI assistant" className="p-2 rounded-lg text-muted hover:text-accent hover:bg-surface-light transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: 'min(52vh, 420px)', minHeight: '240px' }}>
                {error && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-medium" role="alert">
                    <AlertTriangle size={14} />
                    <span>{error}</span>
                  </div>
                )}
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>

              {/* Quick chips */}
              <div className="px-3 pb-2 border-t border-foreground/[0.06] pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {['What technologies does Aman use?', 'Show me his projects', 'What services does he offer?', 'How can I contact him?'].map((q) => (
                    <button key={q} type="button" onClick={() => sendMessage(q)} disabled={isTyping} className="px-2.5 py-1 rounded-full text-[11px] font-mono text-muted border border-foreground/[0.1] hover:text-accent hover:border-accent/40 disabled:opacity-50 transition-colors">
                      {q === 'What technologies does Aman use?' ? 'Technologies' : q === 'Show me his projects' ? 'Projects' : q === 'What services does he offer?' ? 'Services' : 'Contact'}
                    </button>
                  ))}
                </div>
              </div>
            {/* Input */}
              <div className="p-3 border-t border-foreground/[0.08] bg-surface/40">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Ask about Aman's work…"
                    aria-label="Message for the AI assistant"
                    disabled={isTyping}
                    className="flex-1 resize-none bg-surface-light/60 border border-foreground/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 disabled:opacity-60 transition-colors min-h-[42px] max-h-28"
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage(input)}
                    disabled={isTyping || !input.trim()}
                    aria-label="Send message"
                    className="shrink-0 w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_0_12px_var(--accent-glow-subtle)]"
                    data-cursor
                  >
                    <Send size={17} />
                  </button>
                </div>
                <p className="mt-1.5 px-1 text-[10px] text-muted/70">Enter to send · Shift+Enter for a new line</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
