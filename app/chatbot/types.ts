export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  quickReplies?: string[];
  links?: ChatLink[];
  isLeadCapture?: boolean;
}

export interface ChatLink {
  label: string;
  href: string;
}

export interface KnowledgeEntry {
  id: string;
  patterns: string[];
  response: string;
  links?: ChatLink[];
  followUp?: string[];
  category: "services" | "company" | "industries" | "general" | "contact" | "faq";
  priority?: number;
}

export interface ConversationContext {
  messages: ChatMessage[];
  currentTopic: string | null;
  leadCaptured: boolean;
  leadData?: LeadData;
  messageCount: number;
}

export interface LeadData {
  name: string;
  email: string;
  company?: string;
  interest?: string;
  message?: string;
}

export interface ChatbotConfig {
  greeting?: string;
  placeholder?: string;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  position?: "bottom-right" | "bottom-left";
}
