export interface Vehicle {
  distance: number;
  speed: number;
}

export type WarningLevel = 'none' | 'warning' | 'critical';

export interface FCWConfig {
  criticalTTC: number;
  warningTTC: number;
  maxSpeed: number;
}