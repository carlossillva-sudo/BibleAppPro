import React from 'react';
import { cn } from '../utils/cn';

interface Props {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export const NotificationToggleItem: React.FC<Props> = ({ label, value, onChange, disabled }) => {
  return (
    <div className="flex items-center justify-between w-full py-3 px-4">
      <span>{label}</span>
      <label className="relative inline-block w-11 h-6">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="opacity-0 w-0 h-0"
        />
        <span
          className={cn(
            'absolute inset-0 rounded-full transition-colors',
            value ? 'bg-primary' : 'bg-muted',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <span
          className={cn(
            'absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform',
            value ? 'translate-x-5' : ''
          )}
        />
      </label>
    </div>
  );
};
