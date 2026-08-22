'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all flex items-center justify-center ${className}`}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode (Orange & White)'}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-slate-700" />
      ) : (
        <Sun className="w-4 h-4 text-orange-400" />
      )}
    </button>
  );
}
