import React, { useState, useCallback, useEffect } from 'react';
import type { Mood, Resource } from './types';
import MoodSelector from './components/MoodSelector';
import AdviceDisplay from './components/AdviceDisplay';
import QuoteDisplay from './components/QuoteDisplay';
import ThemeToggler from './components/ThemeToggler';
import Spinner from './components/Spinner';
import { generateResponse } from './services/geminiService';

const App: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<string>('');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleSelectMood = useCallback((mood: Mood) => {
    setSelectedMood(mood);
    setAdvice(null);
    setQuote(null);
    setResources(null);
    setError(null);
    setThoughts('');
  }, []);
  
  const handleGenerateResponse = useCallback(async () => {
    if (!selectedMood) return;

    setIsLoading(true);
    setError(null);
    setAdvice(null);
    setQuote(null);
    setResources(null);
    
    try {
      const result = await generateResponse(selectedMood, thoughts);
      setAdvice(result.advice);
      setQuote(result.quote)
      setResources(result.resources);
    } catch (err) {
      if (err instanceof Error) {
        switch (err.name) {
          case 'InvalidResponseError':
            setError("The AI's response was a bit scrambled. Could you try rephrasing your thoughts or simply click the button again?");
            break;
          case 'ApiCommunicationError':
            setError("Failed to connect to the AI. Please check your internet connection and try again. The service may also be busy.");
            break;
          default:
            setError("An unexpected error occurred. We're sorry about that. Please try again in a few moments.");
            break;
        }
      } else {
        setError("An unknown error occurred. We're sorry about that. Please try refreshing the page.");
      }
      setAdvice(null);
      setQuote(null);
      setResources(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMood, thoughts]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="absolute top-4 right-4">
         <ThemeToggler theme={theme} toggleTheme={toggleTheme} />
      </div>
      <main className="container mx-auto max-w-5xl text-center w-full">
        <header className="my-12 flex flex-col items-center">
           <h1 className="text-7xl font-bold tracking-tighter bg-gradient-to-r from-yellow-400 via-brand-primary to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
            Symbio
          </h1>
          <p className="text-lg text-brand-text-muted-light dark:text-brand-text-muted-dark mt-4">
            Your AI companion for mental wellbeing.
          </p>
        </header>

        <section className="mb-12">
           <h2 className="text-3xl font-bold text-brand-text-light dark:text-brand-text-dark mb-8">
            How are you feeling today?
          </h2>
          <MoodSelector 
            selectedMood={selectedMood} 
            onSelectMood={handleSelectMood}
            isLoading={isLoading}
          />
        </section>

        {selectedMood && (
          <section className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 animate-fade-in mb-12">
            <label htmlFor="thoughts-input" className="text-lg text-brand-text-muted-light dark:text-brand-text-muted-dark">
              Share a little more about what's on your mind.
            </label>
            <textarea
              id="thoughts-input"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="e.g., I had a really tough day at work."
              rows={3}
              className="w-full p-4 bg-brand-surface-light dark:bg-brand-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
              aria-label="Share your thoughts"
            />
            <button
              onClick={handleGenerateResponse}
              disabled={isLoading}
              className="px-8 py-4 w-full sm:w-auto font-semibold text-white bg-brand-primary rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-opacity-70 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-light dark:focus:ring-offset-brand-bg-dark focus:ring-brand-primary"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Spinner className="h-5 w-5 text-white" />
                  <span className="ml-2">Thinking...</span>
                </span>
              ) : (
                'Get My Advice'
              )}
            </button>
          </section>
        )}
        
        <section className="w-full grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <AdviceDisplay 
                  advice={advice} 
                  resources={resources} 
                  isLoading={isLoading} 
                  error={error} 
                  selectedMood={selectedMood}
                />
            </div>
            <div className="lg:col-span-2">
                <QuoteDisplay
                  quote={quote}
                  isLoading={isLoading}
                />
            </div>
        </section>
      </main>
      <footer className="w-full text-center py-8 mt-12 text-xs text-brand-text-muted-light dark:text-brand-text-muted-dark">
        <p>Generated with AI. Not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default App;