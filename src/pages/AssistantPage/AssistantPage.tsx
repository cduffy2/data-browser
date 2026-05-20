import { useEffect } from 'react';
import './AssistantPage.css';
import { ConversationProvider, useConversation } from './ConversationContext';
import { ConnectionScreen } from './ConnectionScreen';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';
import { SourceDrawer } from './SourceDrawer';

interface AssistantPageInnerProps {
  initialQuery?: string;
}

function AssistantPageInner({ initialQuery }: AssistantPageInnerProps) {
  const { mcpConnection, activeConversation, simulationMode, setSimulationMode, sendMessage } = useConversation();
  const isEmpty = !activeConversation || activeConversation.messages.length === 0;

  useEffect(() => {
    document.title = 'Pathways | AI Assistant';
  }, []);

  // When arriving from search with a query, enable sim mode and send it
  useEffect(() => {
    const query = initialQuery || sessionStorage.getItem('ai_initial_query') || '';
    sessionStorage.removeItem('ai_initial_query');
    if (query) {
      setSimulationMode(true);
      sendMessage(query);
    }
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mcpConnection.status !== 'connected' && !simulationMode) {
    return <ConnectionScreen />;
  }

  return (
    <div className="assistant-page">
      <ChatSidebar />
      <div className="assistant-page__main">
        <ChatArea />
        <ChatInput isEmpty={isEmpty} />
      </div>
      <SourceDrawer />
    </div>
  );
}

interface AssistantPageProps {
  initialQuery?: string;
}

export function AssistantPage({ initialQuery }: AssistantPageProps) {
  return (
    <ConversationProvider>
      <AssistantPageInner initialQuery={initialQuery} />
    </ConversationProvider>
  );
}
