export interface KITTIFrame {
  frame_id: number;
  timestamp: number;
  objects: {
    type: string;
    truncated: number;
    occluded: number;
    alpha: number;
    bbox: [number, number, number, number];
    dimensions: [number, number, number];
    location: [number, number, number];
    rotation_y: number;
    score?: number;
  }[];
}

export interface DatasetControls {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
}