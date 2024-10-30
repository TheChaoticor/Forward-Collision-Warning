import { Vehicle } from '../types/vehicle';
import { KITTIFrame } from '../types/dataset';

const FRAMES_PER_SECOND = 10;

// Sample KITTI dataset frames with realistic vehicle movements
export const loadKITTIFrames = (): KITTIFrame[] => {
  const frames: KITTIFrame[] = [];
  const totalFrames = 50;
  
  for (let i = 0; i < totalFrames; i++) {
    // Simulate vehicle moving closer, starting from 50m and approaching at varying speeds
    const distance = Math.max(5, 50 - (i * 0.5));
    const speed = 20 + Math.sin(i * 0.1) * 5; // Varying speed between 15-25 km/h
    
    frames.push({
      frame_id: i,
      timestamp: i / FRAMES_PER_SECOND,
      objects: [{
        type: "Car",
        truncated: 0,
        occluded: 0,
        alpha: -1.57,
        bbox: [561.25, 199.77, 728.24, 359.54],
        dimensions: [1.65, 1.67, 3.64],
        location: [1.84, 1.47, distance],
        rotation_y: -1.56,
        speed
      }]
    });
  }
  
  return frames;
};

export const calculateVehicleFromKITTI = (
  currentObject: KITTIFrame['objects'][0],
  previousObject?: KITTIFrame['objects'][0]
): Vehicle => {
  const distance = currentObject.location[2]; // Z coordinate as distance in meters
  
  // Calculate speed from consecutive frames if available
  let speed = 'speed' in currentObject ? currentObject.speed : 0;
  
  if (previousObject && !speed) {
    const distanceDelta = previousObject.location[2] - currentObject.location[2];
    const timeDelta = 1 / FRAMES_PER_SECOND; // seconds between frames
    speed = (distanceDelta / timeDelta) * (3600 / 1000); // Convert m/s to km/h
  }
  
  return {
    distance,
    speed
  };
};