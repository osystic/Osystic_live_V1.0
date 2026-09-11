"use client";

import { useState, useRef, useEffect, useCallback, Component, type ReactNode } from "react";
import type { ChatMessage, ConversationContext, LeadData } from "./types";
import { processMessage, getGreeting, createLeadMessage, createLeadConfirmation } from "./chat-engine";
import "./chatbot.css";

/* ═══════════════════════════════════════════════════════════
   Error Boundary — prevents chatbot crashes from breaking
   the host page.
   ═══════════════════════════════════════════════════════════ */
class ChatbotErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    console.error("[OSYSTIC Chatbot]", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
  }
    return this.props.children;
  }
}

/* ═══════════════════════════════════════════════════════════
   XSS-safe HTML formatter
   Only allows <strong> and <br> tags from the controlled
   knowledge base. Escapes everything else.
   ═══════════════════════════════════════════════════════════ */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMessage(text: string): string {
  // First escape all HTML
  let safe = escapeHtml(text);
  // Then re-introduce only our controlled formatting
  safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  safe = safe.replace(/\n\n/g, "<br/><br/>");
  safe = safe.replace(/\n/g, "<br/>");
  safe = safe.replace(/• /g, "&#8226; ");
  return safe;
}

/* ═══════════════════════════════════════════════════════════
   Main ChatWidget Component
   ═══════════════════════════════════════════════════════════ */
function ChatWidgetInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    messages: [],
    currentTopic: null,
    leadCaptured: false,
    messageCount: 0,
  });
  const [unread, setUnread] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const isMobile = useRef(false);

  // Detect mobile viewport
  useEffect(() => {
    const check = () => { isMobile.current = window.innerWidth <= 640; };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize greeting on first open
  useEffect(() => {
    if (isOpen && !initialized.current) {
      initialized.current = true;
      const greeting = getGreeting();
      setMessages([greeting]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (!isOpen || !isMobile.current) return;
    document.body.classList.add("chatbot-widget-open");
    return () => {
      document.body.classList.remove("chatbot-widget-open");
    };
  }, [isOpen]);

  // Escape key closes chat
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen]);

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = (text || input).trim();
      if (!messageText || isTyping) return;

      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: "user",
        content: messageText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate thinking delay
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

      const { message: assistantMsg, context: newContext } = processMessage(
        messageText,
        context
      );

      if (assistantMsg.isLeadCapture) {
        setShowLeadForm(true);
      }

      setMessages((prev) => [...prev, assistantMsg]);
      setContext((prev) => ({
        ...prev,
        ...newContext,
        messageCount: prev.messageCount + 2,
        messages: [...prev.messages, userMsg, assistantMsg],
      }));
      setIsTyping(false);

      if (!isOpen) {
        setUnread((prev) => prev + 1);
      }
    },
    [input, context, isOpen, isTyping]
  );

  const handleLeadSubmit = useCallback(
    (data: LeadData) => {
      const leadMsg = createLeadMessage(data);
      const confirmMsg = createLeadConfirmation(data);

      setMessages((prev) => [...prev, leadMsg, confirmMsg]);
      setContext((prev) => ({
        ...prev,
        leadCaptured: true,
        leadData: data,
      }));
      setShowLeadForm(false);
      setIsTyping(false);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      // Stop Escape from bubbling to Navbar's handler
      if (e.key === "Escape") {
        e.stopPropagation();
      }
    },
    [handleSend]
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setUnread(0);
      return !prev;
    });
  }, []);

  return (
    <div className="chatbot-widget" role="complementary" aria-label="Chat assistant">
      {/* Chat Panel */}
      {isOpen && (
        <div className="chatbot-panel" ref={panelRef} role="dialog" aria-label="Chat window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar" aria-hidden="true">O</div>
              <div className="chatbot-header-info">
                <h3>OSYSTIC</h3>
                <span className="chatbot-header-info-status">Online</span>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={toggleChat}
              aria-label="Close chat"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-msg ${msg.role === "user" ? "chatbot-msg-user" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="chatbot-msg-avatar chatbot-msg-avatar-assistant" aria-hidden="true">O</div>
                )}
                <div>
                  <div
                    className={`chatbot-bubble ${msg.role === "user" ? "chatbot-bubble-user" : "chatbot-bubble-assistant"}`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                  {msg.links && msg.links.length > 0 && (
                    <div className="chatbot-links">
                      {msg.links.map((link, i) => (
                        <a key={i} href={link.href} className="chatbot-link">
                          {link.label}
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path d="M3 1L7 5L3 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="chatbot-quick-replies" role="group" aria-label="Quick replies">
                      {msg.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          className="chatbot-quick-reply"
                          onClick={() => handleSend(reply)}
                          type="button"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.isLeadCapture && showLeadForm && (
                    <LeadCaptureForm
                      onSubmit={handleLeadSubmit}
                      onCancel={() => setShowLeadForm(false)}
                    />
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="chatbot-msg-avatar chatbot-msg-avatar-user" aria-hidden="true">U</div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-msg" aria-label="Assistant is typing">
                <div className="chatbot-msg-avatar chatbot-msg-avatar-assistant" aria-hidden="true">O</div>
                <div className="chatbot-typing" role="status">
                  <div className="chatbot-typing-dot" />
                  <div className="chatbot-typing-dot" />
                  <div className="chatbot-typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              className="chatbot-input"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              aria-label="Type your message"
              autoComplete="off"
            />
            <button
              className="chatbot-send"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="chatbot-powered" aria-hidden="true">
            Powered by <span style={{ color: "#6b7280" }}>OSYSTIC</span>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        className="chatbot-fab"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.04 2 11C2 13.5 3.2 15.7 5.1 17.2L4 21L7.8 18.8C9.1 19.2 10.5 19.4 12 19.4C17.52 19.4 22 15.36 22 10.4C22 6.04 17.52 2 12 2Z" fill="currentColor"/>
          </svg>
        )}
        {!isOpen && unread > 0 && (
          <div className="chatbot-badge" aria-label={`${unread} unread messages`}>
            {unread > 9 ? "9+" : unread}
          </div>
        )}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Lead Capture Form
   ═══════════════════════════════════════════════════════════ */
function LeadCaptureForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: LeadData) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit({ name, email, company, interest, message });
  };

  return (
    <form className="chatbot-lead-form" onSubmit={handleSubmit}>
      <h4>Share Your Requirements</h4>
      <p>Our team will follow up within 24 hours.</p>
      <div className="chatbot-lead-field">
        <label htmlFor="chatbot-lead-name">Name *</label>
        <input
          id="chatbot-lead-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          autoComplete="name"
        />
      </div>
      <div className="chatbot-lead-field">
        <label htmlFor="chatbot-lead-email">Email *</label>
        <input
          id="chatbot-lead-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="chatbot-lead-field">
        <label htmlFor="chatbot-lead-company">Company</label>
        <input
          id="chatbot-lead-company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company name"
          autoComplete="organization"
        />
      </div>
      <div className="chatbot-lead-field">
        <label htmlFor="chatbot-lead-interest">Interest</label>
        <select
          id="chatbot-lead-interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        >
          <option value="">Select a service</option>
          <option value="ai-agents">AI Agents &amp; Automation</option>
          <option value="enterprise-rag">Enterprise RAG</option>
          <option value="llmops">AI Reliability &amp; LLMOps</option>
          <option value="genai">Generative AI</option>
          <option value="computer-vision">Computer Vision &amp; NLP</option>
          <option value="predictive">Predictive Analytics</option>
          <option value="edge-ai">Edge AI</option>
          <option value="saas">SaaS Product Engineering</option>
          <option value="web">Web Applications</option>
          <option value="mobile">Mobile Apps</option>
          <option value="backend">Backend &amp; APIs</option>
          <option value="data">Data Engineering</option>
          <option value="cloud">Cloud Engineering</option>
          <option value="devops">DevOps &amp; Platform Engineering</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="chatbot-lead-field">
        <label htmlFor="chatbot-lead-message">Message</label>
        <textarea
          id="chatbot-lead-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your project..."
          rows={2}
        />
      </div>
      <div className="chatbot-lead-actions">
        <button type="submit" className="chatbot-lead-btn-primary">Send</button>
        <button type="button" className="chatbot-lead-btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   Exported with error boundary wrapper
   ═══════════════════════════════════════════════════════════ */
export default function ChatWidget() {
  return (
    <ChatbotErrorBoundary>
      <ChatWidgetInner />
    </ChatbotErrorBoundary>
  );
}
