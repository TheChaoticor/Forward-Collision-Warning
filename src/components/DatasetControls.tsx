import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { DatasetControls } from '../types/dataset';

interface DatasetControlsProps extends DatasetControls {
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
}

export default function DatasetControlsView({
  isPlaying,
  currentFrame,
  totalFrames,
  onPlayPause,
  onNext,
  onPrevious,
  onReset,
}: DatasetControlsProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="p-2 hover:bg-gray-700 rounded-lg"
          title="Reset"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={onPrevious}
          className="p-2 hover:bg-gray-700 rounded-lg"
          disabled={currentFrame === 0}
          title="Previous frame"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={onPlayPause}
          className="p-2 hover:bg-gray-700 rounded-lg"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={onNext}
          className="p-2 hover:bg-gray-700 rounded-lg"
          disabled={currentFrame === totalFrames - 1}
          title="Next frame"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
      <div className="text-sm">
        Frame: {currentFrame + 1} / {totalFrames}
      </div>
    </div>
  );
}