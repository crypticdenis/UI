# Testing Guide

Comprehensive testing documentation for the Butler Evaluation UI project.

## 🧪 Test Suite Overview

This project uses **Vitest** as the test runner and **React Testing Library** for component testing.

### Testing Stack

- **Test Runner**: [Vitest](https://vitest.dev/) v4.0+ (Fast, Vite-native test runner)
- **Component Testing**: [React Testing Library](https://testing-library.com/react) v16.3+
- **DOM Testing**: [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) v6.9+
- **User Interactions**: [@testing-library/user-event](https://testing-library.com/docs/user-event/intro) v14.6+
- **Environment**: jsdom (Browser-like environment for Node.js)

## 📁 Test Structure

```
UI/
├── src/
│   ├── test/
│   │   └── setup.js                     # Global test setup
│   └── __tests__/
│       ├── utils/
│       │   └── metricUtils.test.js      # Utility function tests
│       ├── components/
│       │   ├── ContentViewer.test.jsx
│       │   └── NavigationSidebar.test.jsx
│       └── views/
│           ├── ProjectsLandingPage.test.jsx
│           ├── WorkflowsOverview.test.jsx
│           ├── RunsOverview.test.jsx
│           ├── RunDetails.test.jsx
│           ├── QuestionComparison.test.jsx
│           └── RunComparison.test.jsx
├── server/
│   └── __tests__/
│       └── server.test.js               # API/Server tests
└── vite.config.js                       # Test configuration
```

## 🚀 Running Tests

### Available Commands

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once (CI/production)
npm run test:run

# Run tests with UI (interactive browser interface)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Watch Mode

In watch mode, tests automatically re-run when files change:

```bash
npm test
```

**Features:**
- ⚡ Fast re-runs
- 🔍 Filter tests by filename pattern
- 📊 Instant feedback
- 🎯 Run only changed tests

### Coverage Report

Generate a detailed coverage report:

```bash
npm run test:coverage
```

**Output locations:**
- Console: Text summary
- `coverage/index.html`: Interactive HTML report
- `coverage/coverage.json`: JSON report for CI tools

**Coverage thresholds:**
- Statements: Aim for 80%+
- Branches: Aim for 75%+
- Functions: Aim for 80%+
- Lines: Aim for 80%+

## 📝 Test Files

### 1. Utility Tests (`src/__tests__/utils/metricUtils.test.js`)

**Coverage:** 100% of utility functions

**Test Suites:**
- `isNumericScore()` - Validates numeric score detection
- `isScoreField()` - Identifies score-related fields
- `isReasonField()` - Identifies explanation fields
- `extractMetrics()` - Extracts metrics from execution data
- `formatFieldName()` - Formats field names for display
- `getScoreColor()` - Returns color codes for scores
- `calculateAggregateScores()` - Calculates averages
- `getUniqueScoreFields()` - Extracts unique metric fields
- `formatNumber()` - Formats numbers for display

**Example:**
```javascript
describe('getScoreColor', () => {
  it('should return correct colors for 0-1 scale', () => {
    expect(getScoreColor(0.95)).toBe('#059669'); // Dark green
    expect(getScoreColor(0.85)).toBe('#10b981'); // Green
    expect(getScoreColor(0.75)).toBe('#34d399'); // Light green
  });
});
```

### 2. Component Tests (`src/__tests__/components/*.test.jsx`)

**Coverage:** Modal viewer component

**Test Cases:**
- ✅ Renders title and content correctly
- ✅ Close button triggers onClose callback
- ✅ Overlay click triggers onClose
- ✅ Content click does not close modal
- ✅ Handles long content
- ✅ Handles multiline content

**Example:**
```javascript
it('should call onClose when close button is clicked', () => {
  render(<ContentViewer {...defaultProps} />);

  const closeButton = screen.getByRole('button');
  fireEvent.click(closeButton);

  expect(mockOnClose).toHaveBeenCalledTimes(1);
});
```

### 3. Server Tests (`server/__tests__/server.test.js`)

**Coverage:** API endpoints and data formatting

**Test Suites:**
- API endpoint structure validation
- Data formatting functions
- Database schema validation
- Error handling
- Dynamic metrics handling

**Example:**
```javascript
describe('Data Formatting Functions', () => {
  it('should format test run with hierarchical executions', () => {
    const rootExecutions = mockExecutions.filter(e => !e.parent_execution_id);
    const subExecutions = mockExecutions.filter(e => e.parent_execution_id);

    expect(rootExecutions).toHaveLength(1);
    expect(subExecutions).toHaveLength(1);
  });
});
```

## ✍️ Writing Tests

### Basic Test Structure

```javascript
import { describe, it, expect } from 'vitest';

describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Component Testing Pattern

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const mockHandler = vi.fn();
    render(<MyComponent onClick={mockHandler} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Testing Async Code

```javascript
import { waitFor } from '@testing-library/react';

it('should handle async operations', async () => {
  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Mocking

```javascript
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn();

// Mock a module
vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'test' }))
}));

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' })
  })
);
```

## 🎯 Best Practices

### 1. Test Organization

- **One test file per source file**: `component.jsx` → `component.test.jsx`
- **Descriptive test names**: Use "should" statements
- **Group related tests**: Use `describe` blocks
- **Keep tests focused**: One assertion per test when possible

### 2. What to Test

✅ **DO Test:**
- Public API (exported functions)
- User interactions (clicks, inputs)
- Rendering output
- Edge cases and error handling
- Critical business logic

❌ **DON'T Test:**
- Implementation details
- Third-party libraries
- CSS styling (use visual regression instead)
- Private functions directly

### 3. Test Naming

```javascript
// ✅ Good
it('should return empty array when input is null', () => {})
it('should call onSubmit when form is submitted', () => {})

// ❌ Bad
it('test 1', () => {})
it('works', () => {})
```

### 4. Arrange-Act-Assert Pattern

```javascript
it('should calculate total correctly', () => {
  // Arrange: Set up test data
  const items = [1, 2, 3];

  // Act: Execute the function
  const total = calculateTotal(items);

  // Assert: Verify the result
  expect(total).toBe(6);
});
```

## 🔧 Configuration

### Vite Config (`vite.config.js`)

```javascript
export default defineConfig({
  test: {
    globals: true,              // Use global test functions
    environment: 'jsdom',        // Browser-like environment
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        'dist/',
        'docker/',
      ]
    }
  }
});
```

### Test Setup (`src/test/setup.js`)

```javascript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock browser APIs
global.fetch = vi.fn();
window.matchMedia = vi.fn();
```

## 📊 Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| **Utilities** | 100% | 100% ✅ |
| **Components** | 80% | In Progress |
| **Server** | 70% | In Progress |
| **Overall** | 80% | In Progress |

## 🐛 Debugging Tests

### Visual Debug Output

```javascript
import { render, screen } from '@testing-library/react';
import { debug } from '@testing-library/react';

it('debug example', () => {
  const { container } = render(<MyComponent />);

  // Print DOM tree
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

### Watch Specific Tests

```bash
# Run only tests matching pattern
npm test -- metricUtils

# Run tests in specific file
npm test -- src/utils/metricUtils.test.js
```

### Common Issues

**Issue:** "Cannot find module"
```bash
# Solution: Check import paths
# Ensure relative paths are correct
import Component from './Component' // ✅
import Component from 'Component'   // ❌
```

**Issue:** "ReferenceError: document is not defined"
```javascript
// Solution: Ensure jsdom environment is set
// vite.config.js
test: {
  environment: 'jsdom'
}
```

## 🚦 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🎓 Next Steps

1. **Add more component tests** for views (RunDetails, RunsOverview, etc.)
2. **Implement E2E tests** with Playwright or Cypress
3. **Set up visual regression testing** with Percy or Chromatic
4. **Add performance benchmarks** with Vitest bench
5. **Integrate code coverage** into PR checks

---

**Questions?** Check the [main README](../README.md) or open an issue.
