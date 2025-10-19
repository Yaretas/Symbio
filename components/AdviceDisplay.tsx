import React from 'react';
import Spinner from './Spinner';
import ResourceList from './ResourceList';
import type { Resource, Mood } from '../types';

interface AdviceDisplayProps {
  advice: string | null;
  resources: Resource[] | null;
  isLoading: boolean;
  error: string | null;
  selectedMood: Mood | null;
}

const AdviceDisplay: React.FC<AdviceDisplayProps> = ({ advice, resources, isLoading, error, selectedMood }) => {
  return (
    <div className="w-full min-h-[350px] flex flex-col items-center justify-center p-8 bg-brand-surface-light dark:bg-brand-surface-dark rounded-2xl shadow-lg text-center border border-slate-200 dark:border-slate-700">
      {isLoading && <Spinner className="h-8 w-8 text-brand-primary" />}
      
      {!isLoading && error && (
        <div className="text-red-500 dark:text-red-400 animate-fade-in">
          <p className="font-semibold text-lg">Oops! Something went wrong.</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && !advice && (
        <div className="animate-fade-in">
           <h2 className="text-2xl font-bold text-brand-text-light dark:text-brand-text-dark mb-2">Welcome to Symbio</h2>
          <p className="text-lg text-brand-text-muted-light dark:text-brand-text-muted-dark">
            {selectedMood
              ? `Ready to get your advice? Share your thoughts above.`
              : 'Select a mood to begin your journey.'}
          </p>
        </div>
      )}

      {!isLoading && !error && advice && (
        <div className="animate-fade-in w-full">
          <h2 className="text-3xl font-bold text-brand-text-light dark:text-brand-text-dark mb-4">A Thought For You</h2>
          <p className="text-xl md:text-2xl text-brand-text-muted-light dark:text-brand-text-muted-dark leading-relaxed">
            {advice}
          </p>
          {resources && resources.length > 0 && <ResourceList resources={resources} />}
        </div>
      )}
    </div>
  );
};

export default AdviceDisplay;