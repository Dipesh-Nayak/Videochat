export type ChatMessage = {
  id: string;
  content: string;
  sender: 'me' | 'stranger';
  timestamp: Date;
};

export type ConnectionStatus = 
  | 'idle' 
  | 'requesting_permissions'
  | 'waiting' 
  | 'connecting' 
  | 'connected' 
  | 'disconnected' 
  | 'error';

export type VideoState = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
};