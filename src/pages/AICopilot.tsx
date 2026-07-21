import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/useStore';
import { 
  Bot, 
  Mic, 
  Send, 
  Paperclip, 
  Lock, 
  Volume2,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Sparkles,
  FileText,
  MapPin,
  Calculator,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export const AICopilot: React.FC = () => {
  const { messages, isTyping, sendMessage } = useChatStore();
  const [inputText, setInputText] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle auto-expanding textarea height
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [inputText]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleToggleVoice = () => {
    if (voiceActive) {
      setVoiceActive(false);
      toast.info('Voice capture terminated.');
    } else {
      setVoiceActive(true);
      toast.success('Voice dictation online. Speak clearly...', {
        description: 'Verifying biometric audio channels...'
      });
      // Simulate speaking input
      setTimeout(() => {
        setVoiceActive((current) => {
          if (current) {
            setInputText('What insurance coverages do I need for my family?');
            toast.success('Speech transcribed successfully.');
          }
          return false;
        });
      }, 4000);
    }
  };

  const handleFileAttach = () => {
    toast.info('Accessing device ledger vaults for file upload...');
  };

  const suggestedPrompts = [
    { text: 'Explain My Policy', icon: FileText },
    { text: 'Review Coverage', icon: ShieldCheck },
    { text: 'Find Cashless Hospitals', icon: MapPin },
    { text: 'Estimate Claim', icon: Calculator },
    { text: 'Renew Policy', icon: RefreshCw },
    { text: 'Emergency SOS', icon: AlertTriangle }
  ];

  const isInitialState = messages.length === 1 && !isTyping;

  return (
    <div className="relative flex flex-col justify-between bg-background text-on-surface select-none w-full min-h-[calc(100vh-220px)] pb-24 pt-2">
      {/* Top Header Glow */}
      <div className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {isInitialState ? (
        /* Welcome Layout - ChatGPT & Apple Intelligence inspired layout */
        <div className="flex-grow flex flex-col justify-start max-w-2xl mx-auto w-full px-5 relative z-10 space-y-3.5">
          
          {/* AI Greeting Bubble */}
          <div className="flex flex-col items-start gap-1.5 w-full">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-7 h-7 rounded-full bg-tertiary/15 flex items-center justify-center border border-tertiary/30 text-tertiary">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-label-sm text-[11px] text-tertiary uppercase tracking-widest font-semibold">
                Sovereign AI Advisor
              </span>
            </div>
            
            <div className="p-4 rounded-[20px] rounded-tl-none border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl text-on-surface w-[85%] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-tertiary rounded-br-lg" />
              <p className="text-left font-semibold text-white text-[15px]">Hello Joydip! 👋</p>
              <p className="text-left text-on-surface-variant/90 text-[13px] mt-1 leading-relaxed">
                I've analyzed your protection portfolio. What would you like to review today?
              </p>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="w-full bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-[24px] p-3.5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-tertiary/45 to-transparent" />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
              {/* Protection Score */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-[16px] bg-white/[0.02] border border-white/5 hover:border-tertiary/25 hover:bg-white/[0.04] transition-all duration-200">
                <div className="w-7 h-7 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mb-1">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-on-surface-variant/50 font-semibold uppercase tracking-wider text-center">Score</span>
                <span className="text-[15px] font-bold text-tertiary mt-0.5">92%</span>
              </div>

              {/* Coverage Gaps */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-[16px] bg-white/[0.02] border border-white/5 hover:border-error/25 hover:bg-white/[0.04] transition-all duration-200">
                <div className="w-7 h-7 rounded-full bg-error/10 flex items-center justify-center text-error mb-1">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-on-surface-variant/50 font-semibold uppercase tracking-wider text-center">Gaps</span>
                <span className="text-[15px] font-bold text-on-surface mt-0.5">2</span>
              </div>

              {/* Upcoming Renewal */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-[16px] bg-white/[0.02] border border-white/5 hover:border-secondary-fixed-dim/25 hover:bg-white/[0.04] transition-all duration-200">
                <div className="w-7 h-7 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-fixed-dim mb-1">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-on-surface-variant/50 font-semibold uppercase tracking-wider text-center">Renewal</span>
                <span className="text-[15px] font-bold text-on-surface mt-0.5">1</span>
              </div>

              {/* Recommendations */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-[16px] bg-white/[0.02] border border-white/5 hover:border-tertiary/25 hover:bg-white/[0.04] transition-all duration-200">
                <div className="w-7 h-7 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mb-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-on-surface-variant/50 font-semibold uppercase tracking-wider text-center">Insights</span>
                <span className="text-[15px] font-bold text-tertiary mt-0.5">3</span>
              </div>
            </div>
          </div>

          {/* Suggested Action Chips */}
          <div className="w-full">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 flex-nowrap">
              {suggestedPrompts.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPrompt(prompt.text)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3.5 h-10 bg-white/[0.03] border border-white/[0.08] rounded-full text-[12px] text-on-surface-variant/90 hover:text-tertiary hover:border-tertiary/40 hover:bg-white/[0.06] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-tertiary" />
                    {prompt.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Input Box */}
          <div className="w-full">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-tertiary/10 to-primary/10 rounded-[20px] blur opacity-25 group-focus-within:opacity-40 transition duration-300" />
              
              <div className="relative glass-card rounded-[16px] p-2 flex items-center gap-2 min-h-[52px] border border-white/[0.08]">
                <button
                  onClick={handleFileAttach}
                  className="w-11 h-11 text-on-surface-variant/60 hover:text-primary hover:bg-white/5 rounded-[12px] flex items-center justify-center transition-colors cursor-pointer"
                  title="Attach Ledger"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about your insurance..."
                  rows={1}
                  className="flex-1 bg-transparent border-none focus:ring-0 outline-none font-body-md text-xs py-2 resize-none max-h-32 placeholder:text-on-surface-variant/30 text-on-surface text-left"
                />

                <div className="flex gap-1.5">
                  <button
                    onClick={handleToggleVoice}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      voiceActive 
                        ? 'bg-error/15 text-error animate-pulse' 
                        : 'text-tertiary hover:bg-white/5 hover:text-tertiary-fixed-dim'
                    }`}
                    title="Voice Capture"
                  >
                    {voiceActive ? <Volume2 className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                  </button>
                  
                  <button
                    onClick={handleSend}
                    className="bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-all shadow-[0_0_12px_rgba(233,195,73,0.3)] active:scale-95 duration-200 cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center"
                    title="Transmit Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-[9px] text-on-surface-variant/40 mt-3 font-label-sm tracking-wider uppercase flex items-center justify-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              End-to-End Encrypted | Sovereign Intelligence Engine
            </p>
          </div>

        </div>
      ) : (
        /* Chatting Layout - Standard conversation scrolling view */
        <>
          {/* Messages Canvas */}
          <div className="flex-grow overflow-y-auto no-scrollbar px-6 py-4 space-y-6 max-w-4xl mx-auto w-full relative z-10">
            
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              const isWelcome = msg.id === 'welcome';
              
              return (
                <div key={msg.id} className="w-full flex flex-col gap-4">
                  <div
                    className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} gap-2 max-w-[80%] md:max-w-[85%] ${
                      isAi ? 'mr-auto' : 'ml-auto'
                    }`}
                  >
                    {/* Header block for AI */}
                    {isAi && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center border border-tertiary/25 text-on-tertiary">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-label-sm text-[9px] text-tertiary uppercase tracking-widest font-semibold">
                          Sovereign AI Advisor
                        </span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`p-5 rounded-[24px] text-xs leading-relaxed shadow-lg border border-white/8 w-full ${
                        isAi
                          ? isWelcome
                            ? 'bg-white/[0.03] backdrop-blur-xl text-on-surface rounded-tl-none font-body-md'
                            : 'bg-gradient-to-br from-tertiary/10 to-tertiary-container/5 backdrop-blur-md text-on-surface border-tertiary/15 rounded-tl-none font-body-md'
                          : 'bg-surface-container-low text-on-surface rounded-tr-none font-body-md'
                      }`}
                    >
                      {isWelcome ? (
                        <div>
                          <p className="text-left font-semibold text-white text-[13px]">Hello Joydip! 👋</p>
                          <p className="text-left text-on-surface-variant/90 text-xs mt-1.5 leading-relaxed">
                            I've analyzed your protection portfolio. What would you like to review today?
                          </p>
                        </div>
                      ) : isAi ? (
                        <div className="space-y-3">
                          {msg.text.split('\n\n').map((para, pIdx) => {
                            if (para.startsWith('-') || para.startsWith('*')) {
                              return (
                                <ul key={pIdx} className="space-y-1.5 list-none pl-1">
                                  {para.split('\n').map((item, itemIdx) => {
                                    const cleanItem = item.replace(/^[-*]\s+/, '');
                                    const parts = cleanItem.split('**');
                                    return (
                                      <li key={itemIdx} className="flex items-start gap-1.5 text-left">
                                        <span className="text-[10px] mt-0.5 text-tertiary">•</span>
                                        <span>
                                          {parts.map((p, pI) => pI % 2 === 1 ? <strong key={pI} className="font-bold text-white">{p}</strong> : p)}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              );
                            }
                            
                            const codeParts = para.split('`');
                            return (
                              <p key={pIdx} className="text-left">
                                {codeParts.map((part, partIdx) => 
                                  partIdx % 2 === 1 
                                    ? <code key={partIdx} className="bg-on-tertiary/15 border border-on-tertiary/30 px-1.5 py-0.5 rounded font-mono text-[10px] text-tertiary">{part}</code> 
                                    : part.split('**').map((boldPart, boldIdx) => boldIdx % 2 === 1 ? <strong key={boldIdx} className="font-bold text-white">{boldPart}</strong> : boldPart)
                                )}
                              </p>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-left">{msg.text}</p>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[9px] font-label-sm text-on-surface-variant/40 ${isAi ? 'ml-1' : 'mr-1'}`}>
                      {msg.time}
                    </span>
                  </div>

                  {/* If welcome message, show the Insight Card inline in the scroll feed */}
                  {isWelcome && (
                    <div className="max-w-[80%] md:max-w-[85%] mr-auto">
                      <div className="w-full bg-white/[0.02] backdrop-blur-md border border-white/8 rounded-[20px] p-4.5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-tertiary/45 to-transparent" />
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                          {/* Protection Score */}
                          <div className="flex flex-col items-center justify-center p-3 rounded-[16px] bg-white/[0.02] border border-white/5 hover:border-tertiary/25 hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mb-1.5 shadow-[0_0_10px_rgba(233,195,73,0.1)]">
                              <ShieldCheck className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[9px] text-on-surface-variant/50 font-semibold uppercase tracking-wider text-center">Protection Score</span>
                            <span className="text-base font-bold text-tertiary mt-0.5">92%</span>
                          </div>

                          {/* Coverage Gaps */}
                          <div className="flex flex-col items-center justify-center p-3 rounded-[16px] bg-white/[0.02] border border-white/5 hover:border-error/25 hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error mb-1.5 animate-subtle-pulse">
                              <ShieldAlert className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[9px] text-on-surface-variant/50 font-semibold uppercase tracking-wider text-center">Coverage Gaps</span>
                            <span className="text-base font-bold text-on-surface mt-0.5">2</span>
                          </div>

                          {/* Upcoming Renewal */}
                          <div className="flex flex-col items-center justify-center p-3 rounded-[16px] bg-white/[0.02] border border-white/5 hover:border-secondary-fixed-dim/25 hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-fixed-dim mb-1.5">
                              <Calendar className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[9px] text-on-surface-variant/50 font-semibold uppercase tracking-wider text-center">Upcoming Renewal</span>
                            <span className="text-base font-bold text-on-surface mt-0.5">1</span>
                          </div>

                          {/* Recommendations */}
                          <div className="flex flex-col items-center justify-center p-3 rounded-[16px] bg-white/[0.02] border border-white/5 hover:border-tertiary/25 hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mb-1.5">
                              <Sparkles className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[9px] text-on-surface-variant/50 font-semibold uppercase tracking-wider text-center">Recommendations</span>
                            <span className="text-base font-bold text-tertiary mt-0.5">3</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

            {/* Typing loading block */}
            {isTyping && (
              <div className="flex flex-col items-start gap-2 max-w-[80%] md:max-w-[85%] mr-auto animate-pulse">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-label-sm text-[9px] text-tertiary uppercase tracking-widest font-semibold">
                    Thinking...
                  </span>
                </div>
                <div className="bg-white/[0.03] text-on-surface p-4.5 rounded-[24px] border border-white/8 rounded-tl-none text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Sticky Bottom Input Shell */}
          <div className="w-full max-w-2xl mx-auto px-6 pb-6 relative z-10 flex flex-col gap-4">
            
            {/* Predefined Suggestions chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 flex-nowrap animate-slide-up">
              {suggestedPrompts.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPrompt(prompt.text)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4.5 py-2.5 bg-white/[0.03] border border-white/8 rounded-full font-label-md text-[11px] text-on-surface-variant/80 hover:text-tertiary hover:border-tertiary/45 hover:bg-white/[0.06] transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Icon className="w-3.5 h-3.5 text-tertiary" />
                    {prompt.text}
                  </button>
                );
              })}
            </div>

            {/* Message Input Box */}
            <div className="animate-slide-up [animation-delay:0.1s]">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-tertiary/10 to-primary/10 rounded-[24px] blur opacity-25 group-focus-within:opacity-40 transition duration-500" />
                
                <div className="relative glass-card rounded-[24px] p-2.5 flex items-end gap-2 min-h-[52px] border border-white/8">
                  <button
                    onClick={handleFileAttach}
                    className="p-2 text-on-surface-variant/60 hover:text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    title="Attach Ledger"
                  >
                    <Paperclip className="w-4.5 h-4.5" />
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about your insurance..."
                    rows={1}
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none font-body-md text-xs py-2 resize-none max-h-32 placeholder:text-on-surface-variant/30 text-on-surface text-left"
                  />

                  <div className="flex gap-1.5">
                    <button
                      onClick={handleToggleVoice}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        voiceActive 
                          ? 'bg-error/15 text-error animate-pulse' 
                          : 'text-tertiary hover:bg-white/5 hover:text-tertiary-fixed-dim'
                      }`}
                      title="Voice Capture"
                    >
                      {voiceActive ? <Volume2 className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                    </button>
                    
                    <button
                      onClick={handleSend}
                      className="bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-all shadow-[0_0_12px_rgba(233,195,73,0.3)] active:scale-95 duration-200 cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center"
                      title="Transmit Message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-[9px] text-on-surface-variant/40 mt-3 font-label-sm tracking-wider uppercase flex items-center justify-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                End-to-End Encrypted | Sovereign Intelligence Engine
              </p>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
