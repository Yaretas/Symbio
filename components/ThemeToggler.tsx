import React from 'react';

interface ThemeTogglerProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggler: React.FC<ThemeTogglerProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-brand-text-muted-light dark:text-brand-text-muted-dark hover:bg-slate-200/50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-light dark:focus:ring-offset-brand-bg-dark focus:ring-brand-primary transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative h-6 w-6 overflow-hidden">
        {/* Sun Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out ${
            theme === 'light'
              ? 'transform rotate-0 scale-100 opacity-100'
              : 'transform rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        {/* Moon Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out ${
            theme === 'dark'
              ? 'transform rotate-0 scale-100 opacity-100'
              : 'transform -rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggler;