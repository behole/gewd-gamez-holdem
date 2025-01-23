import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with testing-library matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});