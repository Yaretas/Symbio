import React from 'react';
import type { Resource } from '../types';

interface ResourceListProps {
  resources: Resource[];
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold text-center text-brand-text-light dark:text-brand-text-dark mb-4">
        Helpful Resources
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={`https://www.google.com/search?q=${encodeURIComponent(resource.query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-4 bg-brand-bg-light dark:bg-brand-bg-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md hover:border-brand-primary dark:hover:border-brand-primary transition-all duration-200 group"
          >
            <span className="font-semibold text-brand-text-light dark:text-brand-text-dark">{resource.title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-text-muted-light dark:text-brand-text-muted-dark group-hover:text-brand-primary transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        ))}
      </div>
       <p className="text-center text-xs text-brand-text-muted-light dark:text-brand-text-muted-dark mt-4">
        These are search links. If you are in crisis, please call a local emergency number immediately.
      </p>
    </div>
  );
};

export default ResourceList;