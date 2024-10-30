import { Vehicle } from '../types/vehicle';

export const calculateTTC = (egoVehicle: Vehicle, leadVehicle: Vehicle): number => {
  const relativeSpeed = Math.max(0.1, egoVehicle.speed - leadVehicle.speed); // Prevent division by zero
  const relativeDistance = Math.max(0, leadVehicle.distance - egoVehicle.distance);
  
  // Convert speed from km/h to m/s for accurate calculations
  const relativeSpeedMS = relativeSpeed * (1000 / 3600);
  
  return relativeDistance / relativeSpeedMS;
};

export const determineWarningLevel = (
  ttc: number,
  criticalThreshold: number,
  warningThreshold: number
) => {
  if (ttc <= criticalThreshold) return 'critical';
  if (ttc <= warningThreshold) return 'warning';
  return 'none';
};