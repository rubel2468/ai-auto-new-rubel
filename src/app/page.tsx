'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Trash2, Send, Bot, User, Check, Sparkles } from 'lucide-react';

export default function Chat() {
  const { messages, setMessages, sendMessage, status, stop } = useChat();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat from local storage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedMessages = localStorage.getItem('rubel_ai_chat_history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        console.error("Failed to parse chat history");
      }
    }
  }, [setMessages]);

  // Save chat to local storage when messages change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rubel_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages, mounted]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === 'streaming') return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('rubel_ai_chat_history');
    }
  };

  const isLoading = status === 'streaming' || status === 'submitted';

  // Prevent hydration mismatch by not rendering the chat history until mounted
  if (!mounted) return <div className="h-screen bg-gray-50 flex items-center justify-center animate-pulse"><Sparkles className="w-8 h-8 text-indigo-500 animate-spin" /></div>;

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100">
      {/* Modern Header */}
      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200/50">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-tight">Rubel Ai</h1>
              <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online & Ready
              </p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button 
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
              title="Clear Chat History"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-5 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-100 to-purple-50 flex items-center justify-center shadow-inner border border-white">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Hi! I&apos;m Rubel Ai.</h2>
              <p className="max-w-md mx-auto mt-2 text-gray-500 text-lg">I remember our conversations and answer blazingly fast. How can I help you today?</p>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'user';
            const textContent = m.parts?.filter(p => p.type === 'text').map(p => (p as {text?: string}).text).join('') || '';

            return (
              <div key={m.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 opacity-100 duration-300`}>
                <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm
                    ${isUser ? 'bg-gray-100 text-gray-600' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'}
                  `}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col group min-w-[200px]">
                    <div className={`text-[11px] font-semibold mb-1 uppercase tracking-wider ${isUser ? 'text-right text-gray-400 mr-1' : 'text-left text-gray-400 ml-1'}`}>
                      {isUser ? 'You' : 'Rubel Ai'}
                    </div>
                    
                    <div className={`relative px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed shadow-sm
                      ${isUser 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-white border border-gray-200/60 text-gray-800 rounded-tl-sm shadow-indigo-100/20'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{textContent}</p>
                      ) : (
                        <div className="prose prose-sm prose-indigo max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {textContent}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions Row (Copy Button) */}
                    {!isUser && textContent && (
                      <div className="mt-1.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleCopy(textContent, m.id)}
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                        >
                          {copiedId === m.id ? (
                            <><Check size={14} className="text-emerald-500" /> Copied!</>
                          ) : (
                            <><Copy size={14} /> Copy</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {/* Thinking Indicator */}
        {isLoading && (
           <div className="flex w-full justify-start animate-in fade-in duration-300">
             <div className="flex gap-3">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mt-1 text-white shadow-sm">
                 <Bot size={16} />
               </div>
               <div className="flex flex-col">
                 <div className="text-[11px] font-semibold mb-1 ml-1 text-gray-400 uppercase tracking-wider">
                    Rubel Ai is typing...
                 </div>
                 <div className="bg-white border border-gray-200/60 text-gray-800 rounded-3xl rounded-tl-sm shadow-sm px-5 py-4 w-[88px] flex justify-center items-center h-[48px]">
                   <span className="flex gap-1.5 items-center">
                     <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                   </span>
                 </div>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="w-full max-w-4xl mx-auto p-4 pb-6 bg-gradient-to-t from-[#FAFAFA] pt-8">
        <form onSubmit={handleSubmit} className="relative flex items-end shadow-lg shadow-indigo-100/50 rounded-3xl bg-white border border-gray-200 transition-all focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-400">
          <textarea
            className="w-full py-4 pl-6 pr-14 outline-none text-gray-700 bg-transparent resize-none max-h-32 min-h-[56px] rounded-3xl"
            value={input}
            rows={1}
            placeholder="Ask Rubel Ai anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            disabled={isLoading}
          />
          {isLoading ? (
            <button 
              type="button"
              onClick={() => stop()}
              className="absolute right-2 bottom-2 flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-colors"
              title="Stop generating"
            >
              <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="absolute right-2 bottom-2 flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-300 transition-colors shadow-sm"
            >
              <Send size={18} className="ml-1" />
            </button>
          )}
        </form>
        <div className="text-center mt-3">
          <p className="text-[11px] text-gray-400 font-medium">
            Shift + Enter for new line • Chats are saved in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
