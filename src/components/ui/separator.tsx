import React from 'react';

interface SeparatorProps {
  className?: string;
}

export function Separator({ className = '' }: SeparatorProps) {
  return (
    <div className={`border-t border-gray-200 ${className}`} />
  );
}
