import React from 'react';
import { Vehicle } from '../types/vehicle';

interface VehicleControlProps {
  vehicle: Vehicle;
  onSpeedChange: (speed: number) => void;
  label: string;
  maxSpeed: number;
  color: string;
}

export default function VehicleControl({
  vehicle,
  onSpeedChange,
  label,
  maxSpeed,
  color
}: VehicleControlProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{label}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Speed (km/h)</label>
          <input
            type="range"
            min="0"
            max={maxSpeed}
            value={vehicle.speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full"
          />
          <span className={`text-sm ${color}`}>{vehicle.speed} km/h</span>
        </div>
      </div>
    </div>
  );
}