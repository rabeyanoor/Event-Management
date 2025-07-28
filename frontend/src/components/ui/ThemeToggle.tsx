import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors duration-200">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={theme === value ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setTheme(value)}
          className={cn(
            'px-2 py-1.5 text-xs transition-all duration-200',
            theme === value 
              ? 'shadow-md' 
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}