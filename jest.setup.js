/**
 * Jest Setup File
 * 
 * Runs before all tests to set up testing environment.
 */

import '@testing-library/jest-dom';

// `lib/api.ts` calls `getSession()` before each fetch; without this, tests that mock
// `global.fetch` see the session request consume the mock and return undefined.
jest.mock('next-auth/react', () => ({
  __esModule: true,
  getSession: jest.fn().mockResolvedValue(null),
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  SessionProvider: ({ children }) => children,
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// jsdom does not implement scrollIntoView; components that call it on mount would crash tests.
Element.prototype.scrollIntoView = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Suppress console errors in tests (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };

