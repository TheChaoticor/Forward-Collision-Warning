import React from 'react';
import { WarningLevel, Vehicle } from '../types/vehicle';

interface SystemStatusProps {
  ttc: number;
  warningLevel: WarningLevel;
  leadVehicle: Vehicle;
  egoVehicle: Vehicle;
}

export default function SystemStatus({ 
  ttc, 
  warningLevel,
  leadVehicle,
  egoVehicle
}: SystemStatusProps) {
  const warningColors = {
    critical: 'text-red-500',
    warning: 'text-yellow-500',
    none: 'text-green-500'
  };

  const relativeDistance = Math.max(0, leadVehicle.distance - egoVehicle.distance);
  const relativeSpeed = egoVehicle.speed - leadVehicle.speed;

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">System Status</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-gray-400">Time to Collision:</span>
          <span className="ml-2 font-mono">{ttc.toFixed(2)}s</span>
        </div>
        <div>
          <span className="text-gray-400">Warning Level:</span>
          <span className={`ml-2 font-semibold ${warningColors[warningLevel]}`}>
            {warningLevel.toUpperCase()}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Relative Distance:</span>
          <span className="ml-2 font-mono">{relativeDistance.toFixed(1)}m</span>
        </div>
        <div>
          <span className="text-gray-400">Relative Speed:</span>
          <span className="ml-2 font-mono">{relativeSpeed.toFixed(1)} km/h</span>
        </div>
      </div>
    </div>
  );
}