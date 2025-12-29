'use client';

import { useState } from 'react';
import SmartDeviceCard from '@/components/SmartDeviceCard';
import SecurityCameraFeed from '@/components/SecurityCameraFeed';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Shield, 
  Settings,
  Bell,
  User
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

interface Camera {
  id: string;
  name: string;
  location: string;
  feedUrl: string;
  status: 'online' | 'offline';
  isRecording: boolean;
  lastUpdated: string;
}

export default function Home() {
  // Mock data for smart devices
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Living Room Light',
      type: 'light',
      status: 'online',
      isOn: true,
      value: 75,
      unit: '%',
      location: 'Living Room'
    },
    {
      id: '2',
      name: 'Kitchen Thermostat',
      type: 'thermostat',
      status: 'online',
      isOn: true,
      value: 72,
      unit: '°F',
      location: 'Kitchen'
    },
    {
      id: '3',
      name: 'Front Door Camera',
      type: 'camera',
      status: 'online',
      isOn: true,
      value: 180,
      unit: '°',
      location: 'Front Door'
    },
    {
      id: '4',
      name: 'Bedroom Light',
      type: 'light',
      status: 'offline',
      isOn: false,
      value: 0,
      unit: '%',
      location: 'Master Bedroom'
    },
    {
      id: '5',
      name: 'Garage Camera',
      type: 'camera',
      status: 'online',
      isOn: false,
      value: 90,
      unit: '°',
      location: 'Garage'
    },
    {
      id: '6',
      name: 'Office Thermostat',
      type: 'thermostat',
      status: 'online',
      isOn: true,
      value: 68,
      unit: '°F',
      location: 'Home Office'
    }
  ]);

  // Mock data for security cameras
  const [cameras, setCameras] = useState<Camera[]>([
    {
      id: 'cam1',
      name: 'Front Door Camera',
      location: 'Front Entrance',
      feedUrl: '/api/camera/front-door',
      status: 'online',
      isRecording: true,
      lastUpdated: '2 minutes ago'
    },
    {
      id: 'cam2',
      name: 'Backyard Camera',
      location: 'Backyard Patio',
      feedUrl: '/api/camera/backyard',
      status: 'online',
      isRecording: false,
      lastUpdated: '5 minutes ago'
    },
    {
      id: 'cam3',
      name: 'Garage Camera',
      location: 'Garage Interior',
      feedUrl: '/api/camera/garage',
      status: 'offline',
      isRecording: false,
      lastUpdated: '1 hour ago'
    }
  ]);

  const handleDeviceToggle = (deviceId: string, isOn: boolean) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId ? { ...device, isOn } : device
    ));
  };

  const handleDeviceValueChange = (deviceId: string, value: number) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId ? { ...device, value } : device
    ));
  };

  const handleCameraRefresh = (cameraId: string) => {
    // Simulate camera refresh
    console.log(`Refreshing camera: ${cameraId}`);
  };

  const handleCameraRecording = (cameraId: string, isRecording: boolean) => {
    setCameras(prev => prev.map(camera => 
      camera.id === cameraId ? { ...camera, isRecording } : camera
    ));
  };

  const lights = devices.filter(device => device.type === 'light');
  const thermostats = devices.filter(device => device.type === 'thermostat');
  const deviceCameras = devices.filter(device => device.type === 'camera');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Smart Home Control</h1>
                <p className="text-sm text-muted-foreground">Manage your devices and security</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Alerts
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8">
        {/* Security Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Security Cameras</h2>
            <span className="text-sm text-muted-foreground">
              {cameras.filter(cam => cam.status === 'online').length} of {cameras.length} online
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cameras.map((camera) => (
              <SecurityCameraFeed
                key={camera.id}
                camera={camera}
                onRefresh={handleCameraRefresh}
                onToggleRecording={handleCameraRecording}
              />
            ))}
          </div>
        </section>

        {/* Smart Devices Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Smart Devices</h2>
            <span className="text-sm text-muted-foreground">
              {devices.filter(device => device.status === 'online').length} of {devices.length} online
            </span>
          </div>

          {/* Lights */}
          {lights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-4">Lighting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lights.map((device) => (
                  <SmartDeviceCard
                    key={device.id}
                    device={device}
                    onToggle={handleDeviceToggle}
                    onValueChange={handleDeviceValueChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Thermostats */}
          {thermostats.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-4">Climate Control</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {thermostats.map((device) => (
                  <SmartDeviceCard
                    key={device.id}
                    device={device}
                    onToggle={handleDeviceToggle}
                    onValueChange={handleDeviceValueChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Device Cameras */}
          {deviceCameras.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-4">Device Cameras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {deviceCameras.map((device) => (
                  <SmartDeviceCard
                    key={device.id}
                    device={device}
                    onToggle={handleDeviceToggle}
                    onValueChange={handleDeviceValueChange}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* System Status */}
        <section className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {devices.filter(d => d.status === 'online').length}
              </div>
              <div className="text-sm text-muted-foreground">Devices Online</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">
                {cameras.filter(c => c.status === 'online').length}
              </div>
              <div className="text-sm text-muted-foreground">Cameras Online</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">
                {cameras.filter(c => c.isRecording).length}
              </div>
              <div className="text-sm text-muted-foreground">Recording</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


