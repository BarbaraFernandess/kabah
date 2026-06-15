import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Interpretation, InterpretationCategory, InterpretationQuery } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../data/interpretations');

function loadJSON<T>(filePath: string): T | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export class KnowledgeService {
  private cache = new Map<string, Interpretation | null>();

  find(query: InterpretationQuery): Interpretation | null {
    const key = `${query.category}-${query.number}`;

    if (this.cache.has(key)) {
      return this.cache.get(key) ?? null;
    }

    const filePath = resolve(DATA_DIR, query.category, `${query.number}.json`);
    const interpretation = loadJSON<Interpretation>(filePath);
    this.cache.set(key, interpretation);
    return interpretation;
  }

  findMany(queries: InterpretationQuery[]): (Interpretation | null)[] {
    return queries.map((q) => this.find(q));
  }

  listByCategory(category: InterpretationCategory): Interpretation[] {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
    return numbers
      .map((n) => this.find({ category, number: n }))
      .filter((i): i is Interpretation => i !== null);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const knowledgeService = new KnowledgeService();
