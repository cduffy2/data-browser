import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { simulateAssistantResponse } from './simulateResponse';
import type { SourceData } from './simulateResponse';

export interface McpConnection {
  status: 'disconnected' | 'connecting' | 'connected';
  serverUrl: string;
  apiKey: string;
  modelId: string;
  providerId: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  sourceData?: SourceData;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  dataScope?: DataScope;
}

export interface DataScope {
  geography: string;
  healthArea: string;
  segment: string;
}

interface ConversationContextValue {
  mcpConnection: McpConnection;
  connectMCP: (args: { apiKey: string; modelId: string; providerId: string }) => void;
  disconnectMCP: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  isStreaming: boolean;
  sourceDrawerOpen: boolean;
  activeSourceData: SourceData | null;
  dataScope: DataScope;
  setDataScope: (scope: Partial<DataScope>) => void;
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (text: string, scope?: DataScope) => void;
  openSourceDrawer: (sourceData: SourceData) => void;
  closeSourceDrawer: () => void;
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function titleFromMessage(text: string) {
  return text.split(/\s+/).slice(0, 6).join(' ');
}

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [mcpConnection, setMcpConnection] = useState<McpConnection>({
    status: 'disconnected',
    serverUrl: 'http://localhost:3000/mcp',
    apiKey: '',
    modelId: '',
    providerId: '',
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sourceDrawerOpen, setSourceDrawerOpen] = useState(false);
  const [activeSourceData, setActiveSourceData] = useState<SourceData | null>(null);
  const [dataScope, setDataScopeState] = useState<DataScope>({
    geography: '',
    healthArea: '',
    segment: '',
  });

  const activeConversation = conversations.find(c => c.id === activeConversationId) ?? null;

  const connectMCP = useCallback(({ apiKey, modelId, providerId }: { apiKey: string; modelId: string; providerId: string }) => {
    setMcpConnection(prev => ({ ...prev, status: 'connecting', apiKey, modelId, providerId }));
    setTimeout(() => {
      setMcpConnection(prev => ({ ...prev, status: 'connected' }));
    }, 1200);
  }, []);

  const disconnectMCP = useCallback(() => {
    setMcpConnection({
      status: 'disconnected',
      serverUrl: 'http://localhost:3000/mcp',
      apiKey: '',
      modelId: '',
      providerId: '',
    });
    setConversations([]);
    setActiveConversationId(null);
    setSourceDrawerOpen(false);
    setActiveSourceData(null);
  }, []);

  const createConversation = useCallback(() => {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: 'New conversation',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    setConversations(prev => [conv, ...prev]);
    setActiveConversationId(id);
    return id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setActiveConversationId(prev => prev === id ? null : prev);
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c));
  }, []);

  const setDataScope = useCallback((scope: Partial<DataScope>) => {
    setDataScopeState(prev => ({ ...prev, ...scope }));
  }, []);

  const sendMessage = useCallback((text: string, scope?: DataScope) => {
    let convId = activeConversationId;

    if (!convId) {
      convId = generateId();
      const conv: Conversation = {
        id: convId,
        title: titleFromMessage(text),
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
        dataScope: scope,
      };
      setConversations(prev => [conv, ...prev]);
      setActiveConversationId(convId);
    }

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const assistantMsgId = generateId();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    const finalConvId = convId;

    setConversations(prev => prev.map(c => {
      if (c.id !== finalConvId) return c;
      const isFirst = c.messages.length === 0;
      return {
        ...c,
        title: isFirst ? titleFromMessage(text) : c.title,
        updatedAt: new Date(),
        dataScope: scope ?? c.dataScope,
        messages: [...c.messages, userMsg, assistantMsg],
      };
    }));

    setIsStreaming(true);

    simulateAssistantResponse(
      (token) => {
        setConversations(prev => prev.map(c => {
          if (c.id !== finalConvId) return c;
          return {
            ...c,
            messages: c.messages.map(m =>
              m.id === assistantMsgId ? { ...m, content: m.content + token } : m
            ),
          };
        }));
      },
      (sourceData) => {
        setConversations(prev => prev.map(c => {
          if (c.id !== finalConvId) return c;
          return {
            ...c,
            messages: c.messages.map(m =>
              m.id === assistantMsgId ? { ...m, isStreaming: false, sourceData } : m
            ),
          };
        }));
        setIsStreaming(false);
      }
    );
  }, [activeConversationId]);

  const openSourceDrawer = useCallback((sd: SourceData) => {
    setActiveSourceData(sd);
    setSourceDrawerOpen(true);
  }, []);

  const closeSourceDrawer = useCallback(() => {
    setSourceDrawerOpen(false);
    setActiveSourceData(null);
  }, []);

  return (
    <ConversationContext.Provider value={{
      mcpConnection,
      connectMCP,
      disconnectMCP,
      conversations,
      activeConversationId,
      activeConversation,
      isStreaming,
      sourceDrawerOpen,
      activeSourceData,
      dataScope,
      setDataScope,
      createConversation,
      deleteConversation,
      renameConversation,
      setActiveConversationId,
      sendMessage,
      openSourceDrawer,
      closeSourceDrawer,
    }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversation must be used within ConversationProvider');
  return ctx;
}
