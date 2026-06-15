import { describe, it, expect } from 'vitest';
import {
  normalizeAccents,
  normalizeChar,
  filterParticles,
  normalizeName,
  extractLetters,
} from '../src/normalizers/name.normalizer.js';

describe('normalizeChar', () => {
  it('leaves plain uppercase letters unchanged', () => {
    expect(normalizeChar('A')).toBe('A');
    expect(normalizeChar('Z')).toBe('Z');
  });

  it('converts lowercase to uppercase', () => {
    expect(normalizeChar('a')).toBe('A');
  });

  it('removes accent from Á → A', () => expect(normalizeChar('Á')).toBe('A'));
  it('removes accent from Ã → A', () => expect(normalizeChar('Ã')).toBe('A'));
  it('removes accent from É → E', () => expect(normalizeChar('É')).toBe('E'));
  it('removes accent from Ê → E', () => expect(normalizeChar('Ê')).toBe('E'));
  it('removes accent from Í → I', () => expect(normalizeChar('Í')).toBe('I'));
  it('removes accent from Ó → O', () => expect(normalizeChar('Ó')).toBe('O'));
  it('removes accent from Ú → U', () => expect(normalizeChar('Ú')).toBe('U'));
  it('converts Ç → C', () => expect(normalizeChar('Ç')).toBe('C'));
  it('converts Ñ → N', () => expect(normalizeChar('Ñ')).toBe('N'));
});

describe('normalizeAccents', () => {
  it('normalises JOSÉ → JOSE', () => {
    expect(normalizeAccents('JOSÉ')).toBe('JOSE');
  });

  it('normalises João → JOAO', () => {
    expect(normalizeAccents('João')).toBe('JOAO');
  });

  it('normalises ANA LÍVIA → ANA LIVIA', () => {
    expect(normalizeAccents('ANA LÍVIA')).toBe('ANA LIVIA');
  });

  it('normalises CONCEIÇÃO → CONCEICAO', () => {
    expect(normalizeAccents('CONCEIÇÃO')).toBe('CONCEICAO');
  });
});

describe('filterParticles', () => {
  it('removes DE', () =>
    expect(filterParticles(['MARIA', 'DE', 'SOUZA'])).toEqual(['MARIA', 'SOUZA']));

  it('removes DA', () =>
    expect(filterParticles(['SILVA', 'DA', 'COSTA'])).toEqual(['SILVA', 'COSTA']));

  it('removes DO', () =>
    expect(filterParticles(['FILHA', 'DO', 'REI'])).toEqual(['FILHA', 'REI']));

  it('removes DOS and DAS', () =>
    expect(filterParticles(['DOS', 'SANTOS', 'DAS', 'NEVES'])).toEqual(['SANTOS', 'NEVES']));

  it('removes E (conjunction)', () =>
    expect(filterParticles(['JOAO', 'E', 'ANA'])).toEqual(['JOAO', 'ANA']));

  it('keeps non-particle words unchanged', () =>
    expect(filterParticles(['MARIA', 'SILVA'])).toEqual(['MARIA', 'SILVA']));

  it('returns empty array for all-particle input', () =>
    expect(filterParticles(['DE', 'DA', 'DO', 'E'])).toEqual([]));
});

describe('normalizeName', () => {
  it('normalises MARIA DE SOUZA — removes DE', () => {
    const { words, filtered } = normalizeName('MARIA DE SOUZA');
    expect(words).toEqual(['MARIA', 'DE', 'SOUZA']);
    expect(filtered).toEqual(['MARIA', 'SOUZA']);
  });

  it('normalises JOÃO E ANA — removes E and accent', () => {
    const { words, filtered } = normalizeName('JOÃO E ANA');
    expect(words).toEqual(['JOAO', 'E', 'ANA']);
    expect(filtered).toEqual(['JOAO', 'ANA']);
  });

  it('trims leading/trailing whitespace', () => {
    const { filtered } = normalizeName('  MARIA  ');
    expect(filtered).toEqual(['MARIA']);
  });

  it('collapses multiple spaces', () => {
    const { filtered } = normalizeName('MARIA   SILVA');
    expect(filtered).toEqual(['MARIA', 'SILVA']);
  });
});

describe('extractLetters', () => {
  it('extracts letters from words', () => {
    expect(extractLetters(['MARIA', 'SILVA'])).toEqual([
      'M', 'A', 'R', 'I', 'A', 'S', 'I', 'L', 'V', 'A',
    ]);
  });

  it('handles single word', () => {
    expect(extractLetters(['ANA'])).toEqual(['A', 'N', 'A']);
  });
});
