import { describe, it, expect } from 'vitest';
import { EnergyEngine } from '../engine';
import { FiveElement, ImageCard, SelectedCards } from '../types';

describe('EnergyEngine', () => {
  it('should handle empty state correctly', () => {
    const emptySelected: SelectedCards = {
      images: [],
      words: [],
      drawnAt: Date.now(),
    };

    const report = EnergyEngine.analyze(emptySelected);

    expect(report.balanceScore).toBe(0);
    expect(report.dominantElement).toBe('None');
    expect(report.weakElement).toBe('None');
    expect(report.totalScores[FiveElement.WOOD]).toBe(0);
    expect(report.totalScores[FiveElement.FIRE]).toBe(0);
    expect(report.totalScores[FiveElement.EARTH]).toBe(0);
    expect(report.totalScores[FiveElement.METAL]).toBe(0);
    expect(report.totalScores[FiveElement.WATER]).toBe(0);
  });

  it('should handle extreme imbalance correctly (100% one element)', () => {
    const extremeSelected: SelectedCards = {
      images: [
        {
          id: 'img1',
          name: 'img1',
          imageUrl: '',
          elements: {
            [FiveElement.WOOD]: 10,
            [FiveElement.FIRE]: 0,
            [FiveElement.EARTH]: 0,
            [FiveElement.METAL]: 0,
            [FiveElement.WATER]: 0,
          },
        },
      ],
      words: [
        {
          id: 'word1',
          name: 'word1',
          text: 'word1',
          imageUrl: '',
          elements: {
            [FiveElement.WOOD]: 0,
            [FiveElement.FIRE]: 0,
            [FiveElement.EARTH]: 0,
            [FiveElement.METAL]: 0,
            [FiveElement.WATER]: 0,
          },
        },
      ],
      drawnAt: Date.now(),
    };

    const report = EnergyEngine.analyze(extremeSelected);

    expect(report.balanceScore).toBe(0);
    expect(report.dominantElement).toBe(FiveElement.WOOD);
    // Fire is the next element checked after Wood, its score is 0.
    // 0 < 10 and 0 < 101, so minVal = 0, weak = 'fire'.
    // Earth, Metal, Water are also 0, but minVal is 0, so 0 < minVal is false, and weak stays 'fire'.
    expect(report.weakElement).toBe(FiveElement.FIRE);
    expect(report.totalScores[FiveElement.WOOD]).toBe(100);
    expect(report.totalScores[FiveElement.FIRE]).toBe(0);
  });

  it('should handle perfect balance correctly (20% each element)', () => {
    const balancedSelected: SelectedCards = {
      images: [
        {
          id: 'img1',
          name: 'img1',
          imageUrl: '',
          elements: {
            [FiveElement.WOOD]: 20,
            [FiveElement.FIRE]: 20,
            [FiveElement.EARTH]: 20,
            [FiveElement.METAL]: 20,
            [FiveElement.WATER]: 20,
          },
        },
      ],
      words: [],
      drawnAt: Date.now(),
    };

    const report = EnergyEngine.analyze(balancedSelected);

    expect(report.balanceScore).toBe(100);
    expect(report.dominantElement).toBe('None');
    expect(report.weakElement).toBe('None');
    expect(report.totalScores[FiveElement.WOOD]).toBe(20);
    expect(report.totalScores[FiveElement.FIRE]).toBe(20);
    expect(report.totalScores[FiveElement.EARTH]).toBe(20);
    expect(report.totalScores[FiveElement.METAL]).toBe(20);
    expect(report.totalScores[FiveElement.WATER]).toBe(20);
  });

  it('should handle mixed elements correctly', () => {
    const mixedSelected: SelectedCards = {
      images: [
        {
          id: 'img1',
          name: 'img1',
          imageUrl: '',
          elements: {
            [FiveElement.WOOD]: 40,
            [FiveElement.FIRE]: 5,
            [FiveElement.EARTH]: 15,
            [FiveElement.METAL]: 20,
            [FiveElement.WATER]: 20,
          },
        },
      ],
      words: [],
      drawnAt: Date.now(),
    };

    const report = EnergyEngine.analyze(mixedSelected);

    // Total deviation:
    // WOOD: |40 - 20| = 20
    // FIRE: |5 - 20| = 15
    // EARTH: |15 - 20| = 5
    // METAL: |20 - 20| = 0
    // WATER: |20 - 20| = 0
    // Total = 40
    // Score = 100 * (1 - 40 / 160) = 100 * (1 - 0.25) = 75
    expect(report.balanceScore).toBe(75);
    expect(report.dominantElement).toBe(FiveElement.WOOD);
    expect(report.weakElement).toBe(FiveElement.FIRE);
    expect(report.totalScores[FiveElement.WOOD]).toBe(40);
    expect(report.totalScores[FiveElement.FIRE]).toBe(5);
    expect(report.totalScores[FiveElement.EARTH]).toBe(15);
    expect(report.totalScores[FiveElement.METAL]).toBe(20);
    expect(report.totalScores[FiveElement.WATER]).toBe(20);
  });
});
