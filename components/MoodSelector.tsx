import React from 'react';
import type { Mood } from '../types';
import { MOODS } from '../constants';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
  isLoading: boolean;
}

// Icons have been redesigned to be more expressive and aesthetically consistent.
const moodConfig: Record<Mood, { icon: React.ReactElement; color: string; selectedColor: string }> = {
  Joyful: {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z M16 14a4 4 0 00-8 0h8z M9 9.5h.01M15 9.5h.01" />,
    color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400',
    selectedColor: 'ring-yellow-500',
  },
  Happy: {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z M15 15a3 3 0 11-6 0 M9 10h.01M15 10h.01" />,
    color: 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400',
    selectedColor: 'ring-green-500',
  },
  Neutral: {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z M9 15h6 M9 10h.01M15 10h.01" />,
    color: 'text-slate-600 bg-slate-200 dark:bg-slate-700/50 dark:text-slate-400',
    selectedColor: 'ring-slate-500',
  },
  Sad: {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z M15 16a3 3 0 01-6 0 M9 10h.01M15 10h.01" />,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400',
    selectedColor: 'ring-blue-500',
  },
  Depressed: {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z M8 17q2-2 4 0t4 0 M9 10h.01M15 10h.01" />,
    color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-400',
    selectedColor: 'ring-indigo-500',
  },
};

const MoodButton: React.FC<{ mood: Mood; isSelected: boolean; onClick: () => void; disabled: boolean }> = ({ mood, isSelected, onClick, disabled }) => {
  const { icon, color, selectedColor } = moodConfig[mood];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-lg transition-all duration-300 ease-in-out transform focus:outline-none 
      ${color} 
      ${isSelected ? `ring-4 ring-offset-4 dark:ring-offset-brand-bg-dark ${selectedColor} scale-110` : 'hover:scale-105'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-pressed={isSelected}
      aria-label={mood}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 sm:h-10 sm:w-10 mb-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {icon}
      </svg>
      <span className="text-sm font-semibold">{mood}</span>
    </button>
  );
};

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood, isLoading }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
      {MOODS.map((mood) => (
        <MoodButton
          key={mood}
          mood={mood}
          isSelected={selectedMood === mood}
          onClick={() => onSelectMood(mood)}
          disabled={isLoading}
        />
      ))}
    </div>
  );
};

export default MoodSelector;