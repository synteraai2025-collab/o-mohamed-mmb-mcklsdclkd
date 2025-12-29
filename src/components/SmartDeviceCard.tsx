'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Lightbulb, 
  Thermometer, 
  Camera, 
  Wifi, 
  WifiOff,
  Power,
  Settings
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'camera';
  status: 'online' | 'offline';
  isOn: boolean;
  value?: number;
  unit?: string;
  location: string;
}

interface SmartDeviceCardProps {
  device: Device;
  onToggle: (deviceId: string, isOn: boolean) => void;
  onValueChange: (deviceId: string, value: number) => void;
}

export default function SmartDeviceCard({ device, onToggle, onValueChange }: SmartDeviceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      onToggle(device.id, !device.isOn);
    } catch (error) {
      console.error('Failed to toggle device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (value: number[]) => {
    onValueChange(device.id, value[0]);
  };

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'light':
        return <Lightbulb className={`h-6 w-6 ${device.isOn ? 'text-yellow-500' : 'text-gray-400'}`} />;
      case 'thermostat':
        return <Thermometer className={`h-6 w-6 ${device.isOn ? 'text-red-500' : 'text-gray-400'}`} />;
      case 'camera':
        return <Camera className={`h-6 w-6 ${device.isOn ? 'text-green-500' : 'text-gray-400'}`} />;
      default:
        return <Settings className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusIcon = () => {
    return device.status === 'online' ? 
      <Wifi className="h-4 w-4 text-green-500" /> : 
      <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getSliderConfig = () => {
    switch (device.type) {
      case 'light':
        return { min: 0, max: 100, step: 1 };
      case 'thermostat':
        return { min: 50, max: 90, step: 1 };
      case 'camera':
        return { min: 0, max: 360, step: 15 };
      default:
        return { min: 0, max: 100, step: 1 };
    }
  };

  return (
    <Card className={`w-full transition-all duration-200 hover:shadow-lg ${
      device.status === 'offline' ? 'opacity-60' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getDeviceIcon()}
            <div>
              <CardTitle className="text-lg font-semibold">{device.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {device.location}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-xs font-medium ${
              device.status === 'online' ? 'text-green-600' : 'text-red-600'
            }`}>
              {device.status}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Power className={`h-4 w-4 ${
              device.isOn ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="text-sm font-medium">
              {device.isOn ? 'On' : 'Off'}
            </span>
          </div>
          <Switch
            checked={device.isOn}
            onCheckedChange={handleToggle}
            disabled={device.status === 'offline' || isLoading}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {device.isOn && device.type !== 'camera' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {device.type === 'light' ? 'Brightness' : 'Temperature'}
              </span>
              <span className="text-sm text-muted-foreground">
                {device.value}{device.unit}
              </span>
            </div>
            <Slider
              value={[device.value || 0]}
              onValueChange={handleValueChange}
              min={getSliderConfig().min}
              max={getSliderConfig().max}
              step={getSliderConfig().step}
              disabled={device.status === 'offline'}
              className="w-full"
            />
          </div>
        )}

        {device.isOn && device.type === 'camera' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Camera Angle</span>
              <span className="text-sm text-muted-foreground">
                {device.value}°
              </span>
            </div>
            <Slider
              value={[device.value || 0]}
              onValueChange={handleValueChange}
              min={getSliderConfig().min}
              max={getSliderConfig().max}
              step={getSliderConfig().step}
              disabled={device.status === 'offline'}
              className="w-full"
            />
          </div>
        )}

        {device.status === 'offline' && (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              Device is offline. Please check connection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

