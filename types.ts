export type Mood = 'Joyful' | 'Happy' | 'Neutral' | 'Sad' | 'Depressed';

export interface Resource {
  title: string;
  query: string;
}

export interface ApiResponse {
  advice: string;
  quote: string;
  resources: Resource[] | null;
}
