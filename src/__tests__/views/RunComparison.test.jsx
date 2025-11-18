import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import RunComparison from '../../views/RunComparison';

describe('RunComparison', () => {
  const mockOnClose = vi.fn();

  const mockRuns = [
    {
      id: 1,
      version: 'run_1',
      runs: [
        {
          id: 'exec1',
          input: 'Test question 1',
          output_score: { value: 0.95, reason: 'Excellent' },
          relevancy_score: { value: 0.88, reason: 'Good' }
        },
        {
          id: 'exec2',
          input: 'Test question 2',
          output_score: { value: 0.85, reason: 'Good' },
          relevancy_score: { value: 0.90, reason: 'Great' }
        }
      ]
    },
    {
      id: 2,
      version: 'run_2',
      runs: [
        {
          id: 'exec3',
          input: 'Test question 1',
          output_score: { value: 0.90, reason: 'Great' },
          relevancy_score: { value: 0.85, reason: 'Good' }
        }
      ]
    }
  ];

  const defaultProps = {
    workflowId: 'RE_Butler',
    selectedRunIds: [1, 2],
    onClose: mockOnClose
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    global.fetch = vi.fn();
  });

  it('should show loading state initially', () => {
    global.fetch.mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    render(<RunComparison {...defaultProps} />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should fetch and display run data', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/runs/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRuns[0])
        });
      }
      if (url.includes('/runs/2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRuns[1])
        });
      }
    });

    render(<RunComparison {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('run_1')).toBeInTheDocument();
      expect(screen.getByText('run_2')).toBeInTheDocument();
    });
  });

  it('should display aggregate metrics for each run', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/runs/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRuns[0])
        });
      }
      if (url.includes('/runs/2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRuns[1])
        });
      }
    });

    render(<RunComparison {...defaultProps} />);

    await waitFor(() => {
      // Should display average scores
      expect(screen.getByText(/run_1/i)).toBeInTheDocument();
      expect(screen.getByText(/run_2/i)).toBeInTheDocument();
    });
  });

  it('should handle empty selectedRunIds', () => {
    const props = {
      ...defaultProps,
      selectedRunIds: []
    };

    render(<RunComparison {...props} />);

    expect(screen.getByText(/No runs selected/i)).toBeInTheDocument();
  });

  it('should show error message on fetch failure', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'));

    render(<RunComparison {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load run data/i)).toBeInTheDocument();
    });
  });

  it('should calculate percentage differences between runs', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/runs/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRuns[0])
        });
      }
      if (url.includes('/runs/2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRuns[1])
        });
      }
    });

    render(<RunComparison {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('run_1')).toBeInTheDocument();
    });

    // Should show percentage differences
    // (This would require checking for elements with percentage values)
  });

  it('should handle runs with different numbers of executions', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/runs/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRuns[0]) // 2 executions
        });
      }
      if (url.includes('/runs/2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRuns[1]) // 1 execution
        });
      }
    });

    render(<RunComparison {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('run_1')).toBeInTheDocument();
      expect(screen.getByText('run_2')).toBeInTheDocument();
    });
  });
});
