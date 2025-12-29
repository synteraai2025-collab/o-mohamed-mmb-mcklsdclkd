import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface DeviceState {
  devices: Device[];
  cameras: Camera[];
  
  // Device actions
  toggleDevice: (deviceId: string, isOn: boolean) => void;
  updateDeviceValue: (deviceId: string, value: number) => void;
  updateDeviceStatus: (deviceId: string, status: 'online' | 'offline') => void;
  
  // Camera actions
  refreshCamera: (cameraId: string) => void;
  toggleCameraRecording: (cameraId: string, isRecording: boolean) => void;
  updateCameraStatus: (cameraId: string, status: 'online' | 'offline') => void;
  
  // Bulk actions
  setAllDevices: (devices: Device[]) => void;
  setAllCameras: (cameras: Camera[]) => void;
  
  // Utility functions
  getOnlineDevices: () => Device[];
  getOnlineCameras: () => Camera[];
  getRecordingCameras: () => Camera[];
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      devices: [],
      cameras: [],
      
      toggleDevice: (deviceId, isOn) => {
        set((state) => ({
          devices: state.devices.map(device =>
            device.id === deviceId ? { ...device, isOn } : device
          )
        }));
      },
      
      updateDeviceValue: (deviceId, value) => {
        set((state) => ({
          devices: state.devices.map(device =>
            device.id === deviceId ? { ...device, value } : device
          )
        }));
      },
      
      updateDeviceStatus: (deviceId, status) => {
        set((state) => ({
          devices: state.devices.map(device =>
            device.id === deviceId ? { ...device, status } : device
          )
        }));
      },
      
      refreshCamera: (cameraId) => {
        set((state) => ({
          cameras: state.cameras.map(camera =>
            camera.id === cameraId
              ? { ...camera, lastUpdated: new Date().toLocaleTimeString() }
              : camera
          )
        }));
      },
      
      toggleCameraRecording: (cameraId, isRecording) => {
        set((state) => ({
          cameras: state.cameras.map(camera =>
            camera.id === cameraId ? { ...camera, isRecording } : camera
          )
        }));
      },
      
      updateCameraStatus: (cameraId, status) => {
        set((state) => ({
          cameras: state.cameras.map(camera =>
            camera.id === cameraId ? { ...camera, status } : camera
          )
        }));
      },
      
      setAllDevices: (devices) => {
        set({ devices });
      },
      
      setAllCameras: (cameras) => {
        set({ cameras });
      },
      
      getOnlineDevices: () => {
        return get().devices.filter(device => device.status === 'online');
      },
      
      getOnlineCameras: () => {
        return get().cameras.filter(camera => camera.status === 'online');
      },
      
      getRecordingCameras: () => {
        return get().cameras.filter(camera => camera.isRecording);
      }
    }),
    {
      name: 'smart-home-storage',
      partialize: (state) => ({
        devices: state.devices,
        cameras: state.cameras
      })
    }
  )
);

// Utility functions for device management
export const simulateDeviceStatusChange = (deviceId: string, newStatus: 'online' | 'offline') => {
  useDeviceStore.getState().updateDeviceStatus(deviceId, newStatus);
};

export const simulateCameraStatusChange = (cameraId: string, newStatus: 'online' | 'offline') => {
  useDeviceStore.getState().updateCameraStatus(cameraId, newStatus);
};

export const getDeviceStats = () => {
  const state = useDeviceStore.getState();
  const onlineDevices = state.getOnlineDevices();
  const onlineCameras = state.getOnlineCameras();
  const recordingCameras = state.getRecordingCameras();
  
  return {
    totalDevices: state.devices.length,
    onlineDevices: onlineDevices.length,
    offlineDevices: state.devices.length - onlineDevices.length,
    totalCameras: state.cameras.length,
    onlineCameras: onlineCameras.length,
    offlineCameras: state.cameras.length - onlineCameras.length,
    recordingCameras: recordingCameras.length
  };
};

// Mock data initialization
export const initializeMockData = () => {
  const mockDevices: Device[] = [
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
  ];

  const mockCameras: Camera[] = [
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
  ];

  useDeviceStore.getState().setAllDevices(mockDevices);
  useDeviceStore.getState().setAllCameras(mockCameras);
};
