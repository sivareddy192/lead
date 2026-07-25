import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  Zap,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService';

export const AIChatbot = ({ onLeadCaptured }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi there! 👋 I am **LeadDesk AI Assistant**. Ask me about our services, pricing, analytics, or type your requirements to submit an inquiry instantly!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await leadService.sendAIChat({ message: text.trim() });
      if (res.success && res.data) {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: res.data.type,
          stats: res.data.stats,
        };
        setMessages((prev) => [...prev, botMsg]);

        if (res.data.type === 'lead_captured' && onLeadCaptured) {
          toast.success('🎉 New lead inquiry captured by AI!');
          onLeadCaptured(res.data.lead);
        }
      }
    } catch (err) {
      console.error('AI Chatbot Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I'm having trouble connecting right now. Please try again or submit your form directly!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: '💰 Pricing Tiers', text: 'What are your pricing tiers?' },
    { label: '📊 Dashboard Stats', text: 'Show dashboard analytics summary' },
    { label: '📝 Submit Inquiry', text: 'I want to submit a new inquiry: Name: Alex, Email: alex@example.com, Budget: $5000, Need CRM integration' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative flex items-center space-x-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-2xl shadow-brand-500/40 border border-brand-400/30 group"
          >
            <div className="relative">
              <Bot className="w-5 h-5 animate-bounce text-brand-200" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>
            <span>LeadDesk AI</span>
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              ONLINE
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[90vw] max-w-sm sm:max-w-md h-[550px] bg-white dark:bg-navy-900 rounded-3xl border border-gray-200/80 dark:border-navy-700 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat Window Header */}
            <div className="p-4 bg-gradient-to-r from-brand-700 via-brand-600 to-blue-600 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold tracking-tight">LeadDesk AI Assistant</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-brand-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Real-time Intelligent Assistant</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2.5 bg-gray-50 dark:bg-navy-950/60 border-b border-gray-100 dark:border-navy-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qp.text)}
                  disabled={loading}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300 text-[11px] font-bold hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-navy-700 transition-all shadow-sm shrink-0"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-navy-950/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gradient-to-tr from-brand-600 to-blue-500 text-white shadow-md'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-none shadow-md'
                        : 'bg-white dark:bg-navy-800 text-gray-800 dark:text-gray-100 border border-gray-200/70 dark:border-navy-700 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div
                      className={`text-[9px] font-medium mt-1 text-right ${
                        msg.sender === 'user' ? 'text-brand-200' : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <div className="w-7 h-7 rounded-xl bg-navy-800 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-brand-400 animate-spin" />
                  </div>
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white dark:bg-navy-900 border-t border-gray-200/80 dark:border-navy-800 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message or lead requirements..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border border-gray-200 dark:border-navy-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 text-white disabled:opacity-40 hover:scale-105 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatbot;
