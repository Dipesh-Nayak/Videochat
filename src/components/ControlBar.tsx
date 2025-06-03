import React from 'react';
import { Mic, MicOff, Video, VideoOff, UserPlus, Phone } from 'lucide-react';
import Button from './Button';

interface ControlBarProps {
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onFindNew: () => void;
  onDisconnect: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  connectionStatus: string;
  className?: string;
}

const ControlBar: React.FC<ControlBarProps> = ({
  onToggleAudio,
  onToggleVideo,
  onFindNew,
  onDisconnect,
  isAudioEnabled,
  isVideoEnabled,
  connectionStatus,
  className = '',
}) => {
  const isConnected = connectionStatus === 'connected';
  const isWaiting = connectionStatus === 'waiting';
  const isDisconnected = connectionStatus === 'disconnected' || connectionStatus === 'idle';
  const isConnecting = connectionStatus === 'connecting';
  
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-4 ${className}`}>
      <Button
        onClick={onToggleAudio}
        variant="secondary"
        icon={isAudioEnabled ? Mic : MicOff}
        title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
        disabled={isDisconnected}
        className={!isAudioEnabled ? 'bg-red-600 hover:bg-red-700' : ''}
      />
      
      <Button
        onClick={onToggleVideo}
        variant="secondary"
        icon={isVideoEnabled ? Video : VideoOff}
        title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
        disabled={isDisconnected}
        className={!isVideoEnabled ? 'bg-red-600 hover:bg-red-700' : ''}
      />
      
      {isConnected && (
        <Button
          onClick={onFindNew}
          variant="primary"
          icon={UserPlus}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Next
        </Button>
      )}
      
      {(isWaiting || isConnecting) && (
        <Button
          onClick={onDisconnect}
          variant="danger"
          icon={Phone}
          className="rotate-135"
          title="Cancel"
        >
          Cancel
        </Button>
      )}
      
      {isDisconnected && (
        <Button
          onClick={onFindNew}
          variant="primary"
          icon={UserPlus}
          className="bg-green-600 hover:bg-green-700"
        >
          {connectionStatus === 'idle' ? 'Start' : 'New Chat'}
        </Button>
      )}
    </div>
  );
};

export default ControlBar;