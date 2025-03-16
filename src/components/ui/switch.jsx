import React from 'react';

export function Switch({ checked, onCheckedChange, ariaLabel, className }) {
  return (
    <label className={`switch ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        aria-label={ariaLabel}
        className="hidden"
      />
      <span className="slider round"></span>
    </label>
  );
}