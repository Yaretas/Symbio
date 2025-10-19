import React, { useState, useCallback, useRef, useEffect } from 'react';

interface QuoteDisplayProps {
  quote: string | null;
  isLoading: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutId.current) {
        clearTimeout(copyTimeoutId.current);
      }
    };
  }, []);

  const handleCopyQuote = useCallback(() => {
    if (!quote || !navigator.clipboard) return;

    navigator.clipboard.writeText(quote).then(() => {
      setIsCopied(true);
      if (copyTimeoutId.current) {
        clearTimeout(copyTimeoutId.current);
      }
      copyTimeoutId.current = window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy quote: ', err);
    });
  }, [quote]);

  if (isLoading || !quote) {
    return null; // Don't render anything while loading or if there's no quote
  }

  return (
    <div className="relative w-full p-8 bg-brand-surface-light dark:bg-brand-surface-dark rounded-2xl shadow-lg text-center animate-fade-in-delayed border border-slate-200 dark:border-slate-700">
      <svg className="absolute top-4 left-4 h-8 w-8 text-slate-200 dark:text-slate-600" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9.333 22.583h4.583l1.833-3.667v-5.5h-5.5v5.5h3.667l-1.833 3.667zM19.333 22.583h4.583l1.833-3.667v-5.5h-5.5v5.5h3.667l-1.833 3.667z"></path>
      </svg>
      <h3 className="text-lg font-semibold text-brand-text-muted-light dark:text-brand-text-muted-dark mb-4">Inspirational Quote</h3>
      <blockquote className="text-2xl md:text-3xl font-medium text-brand-text-light dark:text-brand-text-dark">
        {quote}
      </blockquote>
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleCopyQuote}
          disabled={isCopied}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-surface-dark focus:ring-brand-primary ${
            isCopied
              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 cursor-default'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-600/50'
          }`}
        >
          {isCopied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuoteDisplay;