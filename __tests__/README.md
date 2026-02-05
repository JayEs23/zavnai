# ZAVN Frontend Tests

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test
npm test goalsApi.test.ts
```

## Test Files

- `goalsApi.test.ts` - Goals API service tests
- `tribeApi.test.ts` - Tribe API service tests
- `DoynChat.test.tsx` - Doyn chat component tests

## Configuration

- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test environment setup and mocks

## Mocks

Global mocks available in all tests:
- `next/navigation` - Next.js router mocked
- `fetch` - Can be mocked with `jest.fn()`
- `window.matchMedia` - Media query mock
- `IntersectionObserver` - Intersection observer mock
- `ResizeObserver` - Resize observer mock

## Coverage Target

**Minimum 70% coverage** for all modules.

View coverage report:
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html
```

## Writing Tests

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

// API service test example
import { myApi } from '@/services/myApi';

global.fetch = jest.fn();

describe('My API', () => {
  it('should fetch data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    const result = await myApi.fetchData();
    expect(result.data).toBe('test');
  });
});
```

## Documentation

See `TESTING_GUIDE.md` in project root for comprehensive documentation.

