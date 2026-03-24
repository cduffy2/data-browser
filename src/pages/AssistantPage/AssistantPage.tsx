import { useEffect } from 'react';
import './AssistantPage.css';
import { ConversationProvider, useConversation } from './ConversationContext';
import { ConnectionScreen } from './ConnectionScreen';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';
import { SourceDrawer } from './SourceDrawer';

function AssistantPageInner() {
  const { mcpConnection } = useConversation();

  useEffect(() => {
    document.title = 'Pathways | AI Assistant';
  }, []);

  if (mcpConnection.status !== 'connected') {
    return <ConnectionScreen />;
  }

  return (
    <div className="assistant-page">
      <ChatSidebar />
      <div className="assistant-page__main">
        <ChatArea />
        <ChatInput />
      </div>
      <SourceDrawer />
    </div>
  );
}

export function AssistantPage() {
  return (
    <ConversationProvider>
      <AssistantPageInner />
    </ConversationProvider>
  );
}
