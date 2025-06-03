import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ConnectionStatus, VideoState } from '../types';

// Simulated delay times in ms
const FINDING_MATCH_DELAY = 3000;
const CONNECTION_DELAY = 2000;

export const useVideoChat = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [videoState, setVideoState] = useState<VideoState>({
    localStream: null,
    remoteStream: null,
    audioEnabled: true,
    videoEnabled: true,
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Initialize local media stream
  const initializeLocalStream = useCallback(async () => {
    try {
      setConnectionStatus('requesting_permissions');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setVideoState(prev => ({
        ...prev,
        localStream: stream,
      }));
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setConnectionStatus('error');
      return null;
    }
  }, []);

  // Clean up media streams
  const cleanupStreams = useCallback(() => {
    if (videoState.localStream) {
      videoState.localStream.getTracks().forEach(track => track.stop());
    }
    
    setVideoState(prev => ({
      ...prev,
      remoteStream: null,
    }));
  }, [videoState.localStream]);

  // Find a new chat partner
  const findNewChat = useCallback(async () => {
    // If we're already in a chat, disconnect first
    if (connectionStatus === 'connected') {
      setConnectionStatus('disconnected');
      if (videoState.remoteStream) {
        setVideoState(prev => ({
          ...prev,
          remoteStream: null,
        }));
      }
      setMessages([]);
    }
    
    // Initialize local stream if not already available
    if (!videoState.localStream) {
      const stream = await initializeLocalStream();
      if (!stream) return; // Failed to get media
    }
    
    // Clear any existing timeouts
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Set status to waiting and start the matching process
    setConnectionStatus('waiting');
    setMessages([]);
    
    // Simulate finding a match after a delay
    const findMatchTimeout = setTimeout(() => {
      setConnectionStatus('connecting');
      
      // Simulate establishing connection after a delay
      const connectTimeout = setTimeout(() => {
        // Create a fake remote stream for demo purposes
        // In a real app, this would come from WebRTC
        const fakeRemoteStream = videoState.localStream?.clone();
        
        setVideoState(prev => ({
          ...prev,
          remoteStream: fakeRemoteStream || null,
        }));
        
        setConnectionStatus('connected');
        
        // Add a welcome message
        const welcomeMessage: ChatMessage = {
          id: uuidv4(),
          content: "Hey there! How's it going?",
          sender: 'stranger',
          timestamp: new Date(),
        };
        
        setMessages([welcomeMessage]);
      }, CONNECTION_DELAY);
      
      setTimeoutId(connectTimeout);
    }, FINDING_MATCH_DELAY);
    
    setTimeoutId(findMatchTimeout);
  }, [connectionStatus, videoState.localStream, videoState.remoteStream, timeoutId, initializeLocalStream]);

  // Disconnect from current chat
  const disconnect = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    if (connectionStatus === 'waiting' || connectionStatus === 'connecting') {
      setConnectionStatus('disconnected');
    } else if (connectionStatus === 'connected') {
      setConnectionStatus('disconnected');
      setMessages([]);
      
      if (videoState.remoteStream) {
        setVideoState(prev => ({
          ...prev,
          remoteStream: null,
        }));
      }
    }
  }, [connectionStatus, timeoutId, videoState.remoteStream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (videoState.localStream) {
      const audioTracks = videoState.localStream.getAudioTracks();
      const enabled = !videoState.audioEnabled;
      
      audioTracks.forEach(track => {
        track.enabled = enabled;
      });
      
      setVideoState(prev => ({
        ...prev,
        audioEnabled: enabled,
      }));
    }
  }, [videoState.localStream, videoState.audioEnabled]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (videoState.localStream) {
      const videoTracks = videoState.localStream.getVideoTracks();
      const enabled = !videoState.videoEnabled;
      
      videoTracks.forEach(track => {
        track.enabled = enabled;
      });
      
      setVideoState(prev => ({
        ...prev,
        videoEnabled: enabled,
      }));
    }
  }, [videoState.localStream, videoState.videoEnabled]);

  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (content.trim() && connectionStatus === 'connected') {
      const newMessage: ChatMessage = {
        id: uuidv4(),
        content,
        sender: 'me',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate receiving a response after a random delay
      if (Math.random() > 0.3) { // 70% chance of response
        const responseDelay = 1000 + Math.random() * 2000;
        
        setTimeout(() => {
          const responses = [
            "That's interesting!",
            "Tell me more about that.",
            "Cool! Where are you from?",
            "Haha, nice one!",
            "I see what you mean.",
            "Have you been doing this for long?",
            "What do you like to do for fun?",
            "I'm enjoying this chat!",
          ];
          
          const responseMessage: ChatMessage = {
            id: uuidv4(),
            content: responses[Math.floor(Math.random() * responses.length)],
            sender: 'stranger',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, responseMessage]);
        }, responseDelay);
      }
    }
  }, [connectionStatus]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      cleanupStreams();
    };
  }, [timeoutId, cleanupStreams]);

  return {
    connectionStatus,
    videoState,
    messages,
    findNewChat,
    disconnect,
    toggleAudio,
    toggleVideo,
    sendMessage,
  };
};

export default useVideoChat;