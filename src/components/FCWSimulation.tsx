import React, { useEffect, useRef, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Vehicle, FCWConfig } from '../types/vehicle';
import { DatasetControls } from '../types/dataset';
import { calculateTTC, determineWarningLevel } from '../utils/collisionCalculator';
import { loadKITTIFrames, calculateVehicleFromKITTI } from '../utils/datasetLoader';
import VehicleControl from './VehicleControl';
import SimulationView from './SimulationView';
import SystemStatus from './SystemStatus';
import DatasetControlsView from './DatasetControls';

const DEFAULT_CONFIG: FCWConfig = {
  criticalTTC: 1.5,  // seconds
  warningTTC: 3.0,   // seconds
  maxSpeed: 120      // km/h
};

const SIMULATION_RATE = 60; // Hz

export default function FCWSimulation() {
  const [leadVehicle, setLeadVehicle] = useState<Vehicle>({ distance: 50, speed: 60 });
  const [egoVehicle, setEgoVehicle] = useState<Vehicle>({ distance: 0, speed: 70 });
  const [warningLevel, setWarningLevel] = useState<'none' | 'warning' | 'critical'>('none');
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [datasetControls, setDatasetControls] = useState<DatasetControls>({
    isPlaying: false,
    currentFrame: 0,
    totalFrames: loadKITTIFrames().length,
  });
  
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const kittiFrames = useRef(loadKITTIFrames());

  const updateWarningLevel = () => {
    const ttc = calculateTTC(egoVehicle, leadVehicle);
    const level = determineWarningLevel(ttc, DEFAULT_CONFIG.criticalTTC, DEFAULT_CONFIG.warningTTC);
    setWarningLevel(level);
  };

  const animate = (timestamp: number) => {
    if (!isAutoMode) return;

    const deltaTime = (timestamp - lastUpdateRef.current) / 1000; // Convert to seconds
    lastUpdateRef.current = timestamp;

    if (deltaTime > 0) {
      setLeadVehicle(prev => ({
        ...prev,
        distance: prev.distance + (prev.speed * deltaTime * (1000 / 3600)), // Convert km/h to m/s
      }));

      setEgoVehicle(prev => ({
        ...prev,
        distance: prev.distance + (prev.speed * deltaTime * (1000 / 3600)), // Convert km/h to m/s
      }));
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  const handlePlayPause = () => {
    setDatasetControls(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleNext = () => {
    setDatasetControls(prev => ({
      ...prev,
      currentFrame: Math.min(prev.currentFrame + 1, prev.totalFrames - 1),
    }));
  };

  const handlePrevious = () => {
    setDatasetControls(prev => ({
      ...prev,
      currentFrame: Math.max(prev.currentFrame - 1, 0),
    }));
  };

  const handleReset = () => {
    setDatasetControls(prev => ({
      ...prev,
      currentFrame: 0,
      isPlaying: false,
    }));
    setEgoVehicle({ distance: 0, speed: 70 });
  };

  useEffect(() => {
    const frame = kittiFrames.current[datasetControls.currentFrame];
    const prevFrame = datasetControls.currentFrame > 0 
      ? kittiFrames.current[datasetControls.currentFrame - 1] 
      : undefined;

    if (frame && frame.objects.length > 0) {
      const vehicle = calculateVehicleFromKITTI(
        frame.objects[0],
        prevFrame?.objects[0]
      );
      setLeadVehicle(vehicle);
    }
  }, [datasetControls.currentFrame]);

  useEffect(() => {
    updateWarningLevel();
  }, [leadVehicle.distance, egoVehicle.distance, leadVehicle.speed, egoVehicle.speed]);

  useEffect(() => {
    if (isAutoMode) {
      lastUpdateRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (datasetControls.isPlaying) {
      interval = setInterval(handleNext, 1000 / SIMULATION_RATE);
    }
    return () => clearInterval(interval);
  }, [datasetControls.isPlaying]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Forward Collision Warning System</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsAutoMode(!isAutoMode);
                handleReset();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              <Settings2 className="w-5 h-5" />
              {isAutoMode ? 'Use Dataset' : 'Use Auto Mode'}
            </button>
          </div>
        </div>

        <SimulationView
          leadVehicle={leadVehicle}
          egoVehicle={egoVehicle}
          warningLevel={warningLevel}
        />

        {!isAutoMode && (
          <div className="mb-8">
            <DatasetControlsView
              {...datasetControls}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleReset}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          <VehicleControl
            vehicle={leadVehicle}
            onSpeedChange={(speed) => setLeadVehicle(prev => ({ ...prev, speed }))}
            label="Lead Vehicle"
            maxSpeed={DEFAULT_CONFIG.maxSpeed}
            color="text-blue-400"
          />
          <VehicleControl
            vehicle={egoVehicle}
            onSpeedChange={(speed) => setEgoVehicle(prev => ({ ...prev, speed }))}
            label="Ego Vehicle"
            maxSpeed={DEFAULT_CONFIG.maxSpeed}
            color="text-green-400"
          />
        </div>

        <SystemStatus
          ttc={calculateTTC(egoVehicle, leadVehicle)}
          warningLevel={warningLevel}
          leadVehicle={leadVehicle}
          egoVehicle={egoVehicle}
        />
      </div>
    </div>
  );
}