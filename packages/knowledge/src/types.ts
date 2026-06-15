export type InterpretationCategory =
  | 'destiny'
  | 'mission'
  | 'soul'
  | 'personality'
  | 'expression'
  | 'motivation'
  | 'impression'
  | 'maturity'
  | 'karmic_lesson'
  | 'karmic_debt'
  | 'hidden_tendency'
  | 'life_cycle'
  | 'challenge'
  | 'personal_year';

export type Interpretation = {
  id: string;
  category: InterpretationCategory;
  number: number;
  title: string;
  summary: string;
  description: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  keywords: string[];
  reference: string;
};

export type InterpretationQuery = {
  category: InterpretationCategory;
  number: number;
};
