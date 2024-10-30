import React from 'react';
import { Car } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import WarningDisplay from './WarningDisplay';
import { WarningLevel } from '../types/vehicle';

interface SimulationViewProps {
  leadVehicle: Vehicle;
  egoVehicle: Vehicle;
  warningLevel: WarningLevel;
}

export default function SimulationView({
  leadVehicle,
  egoVehicle,
  warningLevel
}: SimulationViewProps) {
  // Scale factor to convert meters to percentage (assuming 100m = 100%)
  const SCALE_FACTOR = 1;
  
  // Calculate positions as percentages, keeping them within view
  const leadPosition = (leadVehicle.distance * SCALE_FACTOR) % 100;
  const egoPosition = (egoVehicle.distance * SCALE_FACTOR) % 100;
  
  return (
    <div className="relative h-64 bg-gray-800 rounded-lg mb-8 overflow-hidden">
      <div className="absolute bottom-0 w-full h-20 bg-gray-700" />
      
      {/* Lead Vehicle */}
      <div 
        className="absolute bottom-20 transition-all duration-100"
        style={{ left: `${leadPosition}%` }}
      >
        <Car className="w-12 h-12 text-blue-400" />
      </div>

      {/* Ego Vehicle */}
      <div 
        className="absolute bottom-20 transition-all duration-100"
        style={{ left: `${egoPosition}%` }}
      >
        <Car className="w-12 h-12 text-green-400" />
      </div>

      <WarningDisplay warningLevel={warningLevel} />
    </div>
  );
}