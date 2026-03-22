import { describe, it, expect, vi, beforeEach } from 'vitest';
import { drawCardImage, drawCardWord, clearDeckCache } from './cardEngine';

// Mock `getFullStorageUrl` to just return the path so we don't have to worry about it
vi.mock('../utils/urlHelper', () => ({
  getFullStorageUrl: (url: string) => `mocked-storage-url/${url}`
}));

describe('cardEngine - clearDeckCache', () => {
  beforeEach(() => {
    // Reset fetch mock and window.crypto mock
    global.fetch = vi.fn();

    // Mock global window object if it doesn't exist
    if (typeof window === 'undefined') {
      (global as any).window = {};
    }

    Object.defineProperty((global as any).window, 'crypto', {
      value: {
        getRandomValues: (arr: any) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = i; // Predictable values
          }
        }
      },
      writable: true
    });

    // Clear caches
    clearDeckCache();
  });

  it('should clear all caches when no language is provided', async () => {
    // Setup fetch mock
    const mockImageCards = [{ id: 'img1', image_url: 'img1.png' }];
    const mockWordCards = [{ id: 'word1', image_url: 'word1.png' }];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageCards
    });

    // Populate cache for 'en'
    await drawCardImage(1, 'en');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWordCards
    });

    // Populate word cache for 'en'
    await drawCardWord(1, 'en');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageCards
    });

    // Populate image cache for 'fr'
    await drawCardImage(1, 'fr');

    // Clear all caches
    clearDeckCache();

    // Fetch should be called again since caches are empty
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageCards
    });
    await drawCardImage(1, 'en');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWordCards
    });
    await drawCardWord(1, 'en');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageCards
    });
    await drawCardImage(1, 'fr');

    // 3 initial calls + 3 calls after clear = 6 calls
    expect(global.fetch).toHaveBeenCalledTimes(6);
  });

  it('should clear only the specified language cache', async () => {
    const mockImageCards = [{ id: 'img1', image_url: 'img1.png' }];
    const mockWordCards = [{ id: 'word1', image_url: 'word1.png' }];

    // 1st fetch: en images
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageCards
    });
    await drawCardImage(1, 'en');

    // 2nd fetch: en words
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWordCards
    });
    await drawCardWord(1, 'en');

    // 3rd fetch: fr images
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageCards
    });
    await drawCardImage(1, 'fr');

    // Verify initial fetches
    expect(global.fetch).toHaveBeenCalledTimes(3);

    // Clear 'en' cache only
    clearDeckCache('en');

    // Fetching 'fr' images should not trigger fetch (it's cached)
    await drawCardImage(1, 'fr');
    expect(global.fetch).toHaveBeenCalledTimes(3);

    // Fetching 'en' images should trigger fetch (cache was cleared)
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageCards
    });
    await drawCardImage(1, 'en');
    expect(global.fetch).toHaveBeenCalledTimes(4);

    // Fetching 'en' words should trigger fetch (cache was cleared)
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWordCards
    });
    await drawCardWord(1, 'en');
    expect(global.fetch).toHaveBeenCalledTimes(5);
  });
});
