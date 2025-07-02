'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, id, className = '' }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      id={id}
      onClick={() => onCheckedChange(!checked)}
      className={`w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600 border-blue-600' : 'bg-white'
      } ${className}`}
    >
      {checked && (
        <Check className="w-3 h-3 text-white" />
      )}
    </button>
  );
}
