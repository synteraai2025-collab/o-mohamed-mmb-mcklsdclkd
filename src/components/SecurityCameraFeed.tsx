'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  VideoOff, 
  RefreshCw, 
  AlertCircle,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Maximize2,
  Settings
} from 'lucide-react';

interface Camera {
  id: string;
  name: string;
  location: string;
  feedUrl: string;
  status: 'online' | 'offline';
  isRecording: boolean;
  lastUpdated: string;
}

interface SecurityCameraFeedProps {
  camera: Camera;
  onRefresh: (cameraId: string) => void;
  onToggleRecording: (cameraId: string, isRecording: boolean) => void;
}

export default function SecurityCameraFeed({ camera, onRefresh, onToggleRecording }: SecurityCameraFeedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Simulate loading delay for camera feed
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate random errors for demo purposes
      if (Math.random() > 0.8) {
        setHasError(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [camera.feedUrl]);

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    onRefresh(camera.id);
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsLoading(false);
      if (Math.random() > 0.8) {
        setHasError(true);
      }
    }, 1000);
  };

  const handleToggleRecording = () => {
    onToggleRecording(camera.id, !camera.isRecording);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getStatusIcon = () => {
    return camera.status === 'online' ? 
      <Wifi className="h-4 w-4 text-green-500" /> : 
      <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getRecordingIcon = () => {
    return camera.isRecording ? 
      <Video className="h-4 w-4 text-red-500" /> : 
      <VideoOff className="h-4 w-4 text-gray-400" />;
  };

  return (
    <Card className={`w-full transition-all duration-200 hover:shadow-lg ${
      camera.status === 'offline' ? 'opacity-60' : ''
    } ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className={`h-6 w-6 ${
              camera.status === 'online' ? 'text-primary' : 'text-gray-400'
            }`} />
            <div>
              <CardTitle className="text-lg font-semibold">{camera.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {camera.location}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-xs font-medium ${
              camera.status === 'online' ? 'text-green-600' : 'text-red-600'
            }`}>
              {camera.status}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Camera Feed Container */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-400">Loading camera feed...</p>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-red-500 mb-1">Connection Error</p>
                <p className="text-sm text-gray-400 mb-4">Unable to connect to camera feed</p>
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {camera.status === 'offline' && !isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <VideoOff className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-gray-500 mb-1">Camera Offline</p>
                <p className="text-sm text-gray-400">Please check camera connection</p>
              </div>
            </div>
          )}

          {camera.status === 'online' && !isLoading && !hasError && (
            <div className="relative w-full h-full">
              {/* Simulated Camera Feed */}
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-16 w-16 text-gray-600 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-400 mb-1">Live Camera Feed</p>
                  <p className="text-sm text-gray-500">{camera.name}</p>
                  <p className="text-xs text-gray-600 mt-2">{camera.lastUpdated}</p>
                </div>
              </div>

              {/* Recording Indicator */}
              {camera.isRecording && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  REC
                </div>
              )}

              {/* Camera Controls Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePlayPause}
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 hover:bg-black/70 text-white border-0"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleToggleRecording}
                    variant="secondary"
                    size="sm"
                    className={`bg-black/50 hover:bg-black/70 border-0 ${
                      camera.isRecording ? 'text-red-400' : 'text-white'
                    }`}
                  >
                    {getRecordingIcon()}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRefresh}
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 hover:bg-black/70 text-white border-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleFullscreen}
                    variant="secondary"
                    size="sm"
                    className="bg-black/50 hover:bg-black/70 text-white border-0"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Camera Info and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {getRecordingIcon()}
              <span>{camera.isRecording ? 'Recording' : 'Not Recording'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Auto</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {camera.lastUpdated}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            className="flex-1 gap-2"
            disabled={camera.status === 'offline'}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={handleToggleRecording}
            variant={camera.isRecording ? "destructive" : "default"}
            size="sm"
            className="flex-1 gap-2"
            disabled={camera.status === 'offline'}
          >
            {getRecordingIcon()}
            {camera.isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
