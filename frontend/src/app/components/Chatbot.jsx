import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '👋 Hello! I\'m SiteSense AI, your landslide early warning assistant.\n\nI can help you analyze sensor data, identify risks, and provide actionable recommendations.\n\n**What I can do:**\n• Check current risk levels\n• Explain sensor trends\n• Identify correlations between factors\n• Recommend actions based on thresholds\n\nWhat would you like to know?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };
    checkBackend();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (backendStatus !== 'connected') {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Backend server is not running. Please start the AI server with `cd backend && npm run dev`' 
      }]);
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({ 
        role: m.role === 'assistant' ? 'assistant' : 'user', 
        content: m.content 
      }));
      
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${data.error}` }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Network error. Make sure the backend server is running on port 3001.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What's the current risk level?",
    "Show me the latest readings from all sensors",
    "What factors influence landslide risk the most?",
    "Any critical alerts I should know about?",
    "Compare soil moisture and crack width",
    "What actions should I take right now?",
    "Is there a correlation between rainfall and soil moisture?",
    "Show me the trend for the last 24 hours"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          backgroundColor: 'var(--amber)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={24} color="#000" />
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: isMinimized ? '320px' : '400px',
        height: isMinimized ? '48px' : '560px',
        backgroundColor: 'var(--bg2)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg3)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: backendStatus === 'connected' ? 'var(--green)' : 'var(--red)',
            animation: backendStatus === 'connected' ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
            SiteSense AI Assistant
          </span>
          {backendStatus === 'disconnected' && (
            <span style={{ fontSize: '9px', color: 'var(--red)', marginLeft: '4px' }}>
              (offline)
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    backgroundColor: msg.role === 'user' ? 'var(--amber)' : 'var(--bg3)',
                    color: msg.role === 'user' ? '#000' : 'var(--text)',
                    fontSize: '12px',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '4px 16px 16px 16px',
                  backgroundColor: 'var(--bg3)',
                  fontSize: '12px'
                }}>
                  <span style={{ opacity: 0.7 }}>●</span>
                  <span style={{ opacity: 0.5, marginLeft: '4px' }}>●</span>
                  <span style={{ opacity: 0.3, marginLeft: '4px' }}>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 16px 8px 16px' }}>
              <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '8px' }}>
                SUGGESTED QUESTIONS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestedQuestions.slice(0, 5).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    style={{
                      fontSize: '10px',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg3)'}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={backendStatus === 'connected' ? "Ask about sensor data, risk levels..." : "Start backend server first (cd backend && npm run dev)"}
              disabled={backendStatus !== 'connected'}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg3)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '11px',
                fontFamily: 'Barlow, sans-serif',
                resize: 'none',
                height: '40px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || backendStatus !== 'connected'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '18px',
                backgroundColor: 'var(--amber)',
                border: 'none',
                cursor: isLoading || !input.trim() || backendStatus !== 'connected' ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() || backendStatus !== 'connected' ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={14} color="#000" />
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}