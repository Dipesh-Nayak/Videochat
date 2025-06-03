import React, { useEffect } from 'react';
import { Camera, MessageCircle, Users } from 'lucide-react';
import VideoContainer from './components/VideoContainer';
import ControlBar from './components/ControlBar';
import ChatBox from './components/ChatBox';
import useVideoChat from './hooks/useVideoChat';

function App() {
  const {
    connectionStatus,
    videoState,
    messages,
    findNewChat,
    disconnect,
    toggleAudio,
    toggleVideo,
    sendMessage,
  } = useVideoChat();

  useEffect(() => {
    // Update document title based on connection status
    if (connectionStatus === 'connected') {
      document.title = 'Chatting with Stranger | RandomChat';
    } else if (connectionStatus === 'waiting') {
      document.title = 'Finding a match... | RandomChat';
    } else if (connectionStatus === 'connecting') {
      document.title = 'Connecting... | RandomChat';
    } else {
      document.title = 'RandomChat - Meet new people';
    }
  }, [connectionStatus]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="text-indigo-500" size={28} />
            <h1 className="text-xl font-bold">RandomChat</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-300">
              <Users size={16} />
              <span>5,289 online</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-300">
              <MessageCircle size={16} />
              <span>2.5M chats today</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto p-4 flex flex-col">
        <div className="flex-1 flex flex-col gap-4">
          {/* Video area */}
          <div className="relative flex-1 min-h-[400px] bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <VideoContainer 
              videoState={videoState} 
              connectionStatus={connectionStatus}
              className="h-full"
            />
            
            {/* Chat box */}
            <ChatBox 
              messages={messages}
              onSendMessage={sendMessage}
              isConnected={connectionStatus === 'connected'}
            />
          </div>
          
          {/* Controls */}
          <div className="py-4">
            <ControlBar 
              onToggleAudio={toggleAudio}
              onToggleVideo={toggleVideo}
              onFindNew={findNewChat}
              onDisconnect={disconnect}
              isAudioEnabled={videoState.audioEnabled}
              isVideoEnabled={videoState.videoEnabled}
              connectionStatus={connectionStatus}
              className="max-w-md mx-auto"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-3 px-4 text-center text-sm text-gray-400">
        <div className="container mx-auto">
          <p>© 2025 RandomChat. Connect with strangers safely.</p>
          <div className="mt-1 flex justify-center gap-4">
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Safety</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;