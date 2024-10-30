import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { WarningLevel } from '../types/vehicle';

interface WarningDisplayProps {
  warningLevel: WarningLevel;
}

export default function WarningDisplay({ warningLevel }: WarningDisplayProps) {
  if (warningLevel === 'none') return null;

  const styles = {
    critical: 'bg-red-500 animate-pulse',
    warning: 'bg-yellow-500',
    none: 'bg-green-500'
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${styles[warningLevel]}`}>
        <AlertTriangle className="w-5 h-5" />
        <span className="font-semibold">
          {warningLevel === 'critical' ? 'BRAKE NOW!' : 'Warning: Vehicle Ahead'}
        </span>
      </div>
    </div>
  );
}