import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GeminiService } from './geminiService';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: vi.fn(),
      };
      constructor() {}
    },
    Type: { OBJECT: 'OBJECT', STRING: 'STRING', NUMBER: 'NUMBER' },
    ThinkingLevel: { HIGH: 'HIGH' }
  };
});

describe('GeminiService Constructor', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should successfully instantiate when GEMINI_API_KEY is provided', () => {
    process.env.GEMINI_API_KEY = 'test-api-key';
    const service = new GeminiService();
    expect(service).toBeInstanceOf(GeminiService);
  });

  it('should throw an error when GEMINI_API_KEY is not set', () => {
    delete process.env.GEMINI_API_KEY;

    expect(() => {
      new GeminiService();
    }).toThrow('GEMINI_API_KEY is not set in environment variables');
  });

  it('should throw an error when GEMINI_API_KEY is empty string', () => {
    process.env.GEMINI_API_KEY = '';

    expect(() => {
      new GeminiService();
    }).toThrow('GEMINI_API_KEY is not set in environment variables');
  });
});
