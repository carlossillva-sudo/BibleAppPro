import React from 'react';
import { cn } from '../utils/cn';

interface Props {
  label: string;
  time: string;
  onChange: (t: string) => void;
  disabled?: boolean;
}

export const TimeSelectorItem: React.FC<Props> = ({ label, time, onChange, disabled }) => {
  return (
    <div className="flex items-center justify-between w-full py-3 px-4">
      <span>{label}</span>
      <input
        type="time"
        value={time}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'border rounded-lg px-2 py-1',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
    </div>
  );
};
