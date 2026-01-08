
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Movement } from '../../types';
import { getApiUrl } from '../../config';
import './ChatInterface.css';

interface Message {
  role: 'ai' | 'user';
  content: string;
}

interface Props {
  activeQuery: string;
  results: Movement[];
}

const ChatInterface: React.FC<Props> = ({ activeQuery, results }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastAnalyzedQueryRef = useRef<string>('');

  // Create a stable key for results to prevent unnecessary re-renders
  const resultsFingerprint = results.map(r => r.id).join(',');

  useEffect(() => {
    // Initial analysis when query changes
    const timer = setTimeout(() => {
        // Construct a unique key for the current search state
        const currentSearchKey = `${activeQuery}-${resultsFingerprint}`;
        
        // Only generate if we have a query, results, and we haven't analyzed this exact combo yet
        if (activeQuery && results.length > 0 && currentSearchKey !== lastAnalyzedQueryRef.current) {
            lastAnalyzedQueryRef.current = currentSearchKey; // Mark as processed
            setMessages([]); // Clear history on new search
            generateResponse(null); // Generate initial summary
        } else if (!activeQuery && messages.length === 0) {
            setMessages([{role: 'ai', content: "Hello! Ready to analyze online social movements. Enter a query to begin historical synthesis."}]);
    }
    }, 800); 

    return () => clearTimeout(timer);
  }, [activeQuery, resultsFingerprint]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = async (userMessage: string | null) => {
    setIsTyping(true);
    
    // Construct prompt
    // If it's the initial summary (userMessage is null), we ask for a summary.
    // If it's a follow-up, we pass the user's question.
    const queryToSend = userMessage || `Summarize the key themes and findings from the searched movements related to "${activeQuery}".`;

    try {
        const response = await fetch(getApiUrl('/api/chat'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: queryToSend,
                context_movements: results.map(r => `ID ${r.id}: ${r.name} (${r.year}) - ${r.description.substring(0, 100)}...`)
            })
        });
        const data = await response.json();
        
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to Analysis Engine." }]);
    } finally {
        setIsTyping(false);
      }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    generateResponse(userMsg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <div className="bot-header">
        <Bot size={20} />
        <span>SocialGraph-Agent v1.2</span>
      </div>
      
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
        <div className="message-content">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
            </div>
        ))}
        
        {isTyping && (
            <div className="message ai">
                <div className="typing-indicator" style={{ display: 'flex' }}>
                    <span></span><span></span><span></span>
          </div>
        </div>
      )}
      </div>

      <div className="chat-input-area">
        <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            disabled={isTyping}
        />
        <button className="send-btn" onClick={handleSend} disabled={isTyping || !input.trim()}>
            <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
