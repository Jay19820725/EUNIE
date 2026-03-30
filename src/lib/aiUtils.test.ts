import { test, describe } from 'node:test';
import assert from 'node:assert';
import { withRetry } from './aiUtils.ts';

describe('withRetry', () => {
  test('should return result on successful first attempt', async () => {
    let calls = 0;
    const task = async () => {
      calls++;
      return 'success';
    };

    const result = await withRetry(task);
    assert.strictEqual(result, 'success');
    assert.strictEqual(calls, 1);
  });

  test('should retry on 429 error and eventually succeed', async () => {
    let calls = 0;
    const task = async () => {
      calls++;
      if (calls < 2) {
        const err = new Error('Rate limit exceeded 429');
        (err as any).status = 429;
        throw err;
      }
      return 'success after retry';
    };

    const result = await withRetry(task, 3, 10); // Small delay for testing
    assert.strictEqual(result, 'success after retry');
    assert.strictEqual(calls, 2);
  });

  test('should retry on RESOURCE_EXHAUSTED error', async () => {
    let calls = 0;
    const task = async () => {
      calls++;
      if (calls < 2) {
        throw new Error('RESOURCE_EXHAUSTED');
      }
      return 'success';
    };

    const result = await withRetry(task, 3, 10);
    assert.strictEqual(result, 'success');
    assert.strictEqual(calls, 2);
  });

  test('should throw immediately on non-retryable error', async () => {
    let calls = 0;
    const task = async () => {
      calls++;
      throw new Error('Fatal error');
    };

    await assert.rejects(withRetry(task, 3, 10), {
      message: 'Fatal error'
    });
    assert.strictEqual(calls, 1);
  });

  test('should exhausted retries and throw last error', async () => {
    let calls = 0;
    const task = async () => {
      calls++;
      const err = new Error('Rate limit exceeded 429');
      (err as any).status = 429;
      throw err;
    };

    await assert.rejects(withRetry(task, 2, 10), {
      message: 'Rate limit exceeded 429'
    });
    assert.strictEqual(calls, 3); // Initial + 2 retries
  });
});
