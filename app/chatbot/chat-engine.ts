import type { ChatMessage, ConversationContext, KnowledgeEntry, LeadData } from "./types";
import { knowledgeBase, fallbackResponses } from "./knowledge-base";

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateScore(input: string, patterns: string[]): number {
  const normalized = normalize(input);
  const words = normalized.split(" ");
  let score = 0;

  for (const pattern of patterns) {
    const normalizedPattern = normalize(pattern);
    if (normalized === normalizedPattern) {
      score += 100;
      continue;
    }
    if (normalized.includes(normalizedPattern)) {
      score += 50 + (normalizedPattern.length / normalized.length) * 30;
      continue;
    }
    if (normalizedPattern.includes(normalized)) {
      score += 30 + (normalized.length / normalizedPattern.length) * 20;
      continue;
    }
    const patternWords = normalizedPattern.split(" ");
    const matchingWords = words.filter((w) => patternWords.includes(w));
    if (matchingWords.length > 0) {
      score += (matchingWords.length / patternWords.length) * 40;
    }
  }

  return score;
}

function findBestMatch(
  input: string,
  context: ConversationContext
): KnowledgeEntry | null {
  const scored = knowledgeBase.map((entry) => {
    let score = calculateScore(input, entry.patterns);
    if (entry.priority) {
      score *= 1 + entry.priority * 0.05;
    }
    if (context.currentTopic) {
      const related = knowledgeBase.find((e) => e.id === context.currentTopic);
      if (related && related.followUp) {
        const inputNorm = normalize(input);
        for (const fu of related.followUp) {
          if (normalize(fu) === inputNorm) {
            score += 20;
          }
        }
      }
    }
    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);

  if (scored[0].score >= 15) {
    return scored[0].entry;
  }

  return null;
}

export function processMessage(
  input: string,
  context: ConversationContext
): { message: ChatMessage; context: Partial<ConversationContext> } {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      message: {
        id: generateId(),
        role: "assistant",
        content: "Please type a message and I'll do my best to help!",
        timestamp: Date.now(),
      },
      context: {},
    };
  }

  const leadIntentPatterns = [
    "capture my requirements",
    "capture my info",
    "share my details",
    "take my info",
    "let me share",
    "i want to share",
    "here are my requirements",
    "my project",
    "my requirement",
    "i need help with",
    "i have a project",
    "tell you about my project",
  ];

  const isLeadIntent = leadIntentPatterns.some((p) =>
    normalize(trimmed).includes(normalize(p))
  );

  if (isLeadIntent && !context.leadCaptured) {
    return {
      message: {
        id: generateId(),
        role: "assistant",
        content:
          "I'd love to learn about your project! Please share your details below and our team will follow up with you.",
        timestamp: Date.now(),
        isLeadCapture: true,
      },
      context: { currentTopic: "lead-capture" },
    };
  }

  const match = findBestMatch(trimmed, context);

  if (match) {
    const quickReplies = match.followUp || [];
    return {
      message: {
        id: generateId(),
        role: "assistant",
        content: match.response,
        timestamp: Date.now(),
        links: match.links,
        quickReplies,
      },
      context: {
        currentTopic: match.id,
        messages: [],
      },
    };
  }

  const isTechnical = /\b(api|code|debug|error|implement|deploy|server|database|schema|model|train|inference|pipeline)\b/i.test(
    trimmed
  );
  const isPricing = /\b(price|cost|how much|rate|budget|expensive|cheap|afford)\b/i.test(
    trimmed
  );

  let content = fallbackResponses.default;
  if (isTechnical) content = fallbackResponses.technical;
  if (isPricing) content = fallbackResponses.pricing;

  return {
    message: {
      id: generateId(),
      role: "assistant",
      content,
      timestamp: Date.now(),
      quickReplies: [
        "What services do you offer?",
        "I'd like to book a call",
        "Tell me about OSYSTIC",
      ],
    },
    context: { currentTopic: null },
  };
}

export function createLeadMessage(data: LeadData): ChatMessage {
  return {
    id: generateId(),
    role: "user",
    content: `Name: ${data.name}\nEmail: ${data.email}${data.company ? `\nCompany: ${data.company}` : ""}${data.interest ? `\nInterest: ${data.interest}` : ""}${data.message ? `\nMessage: ${data.message}` : ""}`,
    timestamp: Date.now(),
  };
}

export function createLeadConfirmation(data: LeadData): ChatMessage {
  return {
    id: generateId(),
    role: "assistant",
    content: `Thank you, ${data.name}! I've captured your details. Our team will follow up with you at ${data.email} shortly.\n\nIn the meantime, feel free to explore more about our services or ask any other questions.`,
    timestamp: Date.now(),
    links: [
      { label: "View Our Services", href: "/capabilities" },
      { label: "Read Case Studies", href: "/case-studies" },
    ],
    quickReplies: [
      "What services do you offer?",
      "Tell me about your process",
    ],
  };
}

export function getGreeting(): ChatMessage {
  return {
    id: generateId(),
    role: "assistant",
    content:
      "Hello! I'm the OSYSTIC assistant. I can help you learn about our AI and software engineering services.\n\nWhat would you like to know?",
    timestamp: Date.now(),
    quickReplies: [
      "What services do you offer?",
      "Tell me about OSYSTIC",
      "Which industries do you serve?",
      "I have a project in mind",
    ],
  };
}
