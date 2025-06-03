import React, { useRef, useEffect } from 'react';
import { VideoState } from '../types';

interface VideoContainerProps {
  videoState: VideoState;
  connectionStatus: string;
  className?: string;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ 
  videoState, 
  connectionStatus,
  className = '' 
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && videoState.localStream) {
      localVideoRef.current.srcObject = videoState.localStream;
    }
  }, [videoState.localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && videoState.remoteStream) {
      remoteVideoRef.current.srcObject = videoState.remoteStream;
    }
  }, [videoState.remoteStream]);

  const isConnected = connectionStatus === 'connected';

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Remote video (or placeholder) */}
      {isConnected && videoState.remoteStream ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gray-900"
        />
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-gray-500 text-center p-4">
            {connectionStatus === 'waiting' && (
              <div className="animate-pulse">
                <p className="text-xl mb-2">Looking for someone to chat with...</p>
                <div className="flex justify-center">
                  <div className="h-3 w-3 bg-indigo-500 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-3 w-3 bg-indigo-500 rounded-full mr-1 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            {connectionStatus === 'connecting' && (
              <div className="animate-pulse">
                <p className="text-xl mb-2">Connecting...</p>
                <div className="flex justify-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-1 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            {connectionStatus === 'disconnected' && (
              <p className="text-xl">Disconnected. Click "New Chat" to start again.</p>
            )}
            {connectionStatus === 'error' && (
              <p className="text-xl text-red-500">Error connecting. Please check your camera and microphone permissions.</p>
            )}
            {connectionStatus === 'idle' && (
              <p className="text-xl">Click "Start" to begin chatting with strangers.</p>
            )}
            {connectionStatus === 'requesting_permissions' && (
              <p className="text-xl">Please allow access to your camera and microphone.</p>
            )}
          </div>
        </div>
      )}

      {/* Local video (small overlay) */}
      {videoState.localStream && (
        <div className="absolute bottom-4 right-4 w-1/4 max-w-[160px] aspect-video rounded-lg overflow-hidden border-2 border-indigo-500 shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!videoState.videoEnabled ? 'hidden' : ''}`}
          />
          {!videoState.videoEnabled && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-xs text-gray-400">Camera off</span>
            </div>
          )}
        </div>
      )}

      {/* Connection status indicator */}
      <div className="absolute top-4 left-4">
        <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
          connectionStatus === 'connected' ? 'bg-green-500/70 text-white' : 
          connectionStatus === 'waiting' ? 'bg-yellow-500/70 text-white' :
          connectionStatus === 'connecting' ? 'bg-blue-500/70 text-white' :
          'bg-gray-500/70 text-white'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-1 ${
            connectionStatus === 'connected' ? 'bg-green-300' : 
            connectionStatus === 'waiting' ? 'bg-yellow-300' :
            connectionStatus === 'connecting' ? 'bg-blue-300' :
            'bg-gray-300'
          }`}></div>
          <span className="capitalize">{connectionStatus.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;