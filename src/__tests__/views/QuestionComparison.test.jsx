import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionComparison from '../../views/QuestionComparison';

describe('QuestionComparison', () => {
  const mockOnClose = vi.fn();

  const mockAllRuns = [
    {
      id: 1,
      version: 'run_1',
      runs: [
        {
          id: 'exec1',
          input: 'Test question',
          expected_output: 'Expected answer',
          output_score: { value: 0.95, reason: 'Excellent' },
          relevancy_score: { value: 0.88, reason: 'Good' },
          executionTs: '2025-01-01T10:00:00'
        }
      ]
    },
    {
      id: 2,
      version: 'run_2',
      runs: [
        {
          id: 'exec2',
          input: 'Test question',
          expected_output: 'Expected answer',
          output_score: { value: 0.90, reason: 'Great' },
          relevancy_score: { value: 0.85, reason: 'Good' },
          executionTs: '2025-01-02T10:00:00'
        }
      ]
    }
  ];

  const defaultProps = {
    baseID: 'exec1',
    currentRunVersion: 'run_1',
    allRuns: mockAllRuns,
    onClose: mockOnClose
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should render comparison header', () => {
    render(<QuestionComparison {...defaultProps} />);

    expect(screen.getByText(/Question Comparison/i)).toBeInTheDocument();
    expect(screen.getByText('Test question')).toBeInTheDocument();
  });

  it('should display base execution details', () => {
    render(<QuestionComparison {...defaultProps} />);

    expect(screen.getByText('Test question')).toBeInTheDocument();
    expect(screen.getByText('Expected answer')).toBeInTheDocument();
  });

  it('should show available run versions for selection', () => {
    render(<QuestionComparison {...defaultProps} />);

    expect(screen.getByText(/run_1/)).toBeInTheDocument();
    expect(screen.getByText(/run_2/)).toBeInTheDocument();
  });

  it('should toggle version selection when clicked', () => {
    render(<QuestionComparison {...defaultProps} />);

    // run_1 should be selected by default (currentRunVersion)
    const run2Card = screen.getByText(/run_2/).closest('.version-card');
    fireEvent.click(run2Card);

    // Now both should be selected
    expect(run2Card).toHaveClass('selected');
  });

  it('should limit selection to 2 runs maximum', () => {
    const threeRuns = [
      ...mockAllRuns,
      {
        id: 3,
        version: 'run_3',
        runs: [
          {
            id: 'exec3',
            input: 'Test question',
            output_score: { value: 0.85, reason: 'Good' },
            relevancy_score: { value: 0.90, reason: 'Great' },
            executionTs: '2025-01-03T10:00:00'
          }
        ]
      }
    ];

    render(<QuestionComparison {...defaultProps} allRuns={threeRuns} />);

    // Select run_2
    const run2Card = screen.getByText(/run_2/).closest('.version-card');
    fireEvent.click(run2Card);

    // Try to select run_3 (should replace run_1)
    const run3Card = screen.getByText(/run_3/).closest('.version-card');
    fireEvent.click(run3Card);

    // Only 2 should be selected
    const selectedCards = document.querySelectorAll('.version-card.selected');
    expect(selectedCards).toHaveLength(2);
  });

  it('should display metrics for selected versions', () => {
    render(<QuestionComparison {...defaultProps} />);

    // Select run_2
    const run2Card = screen.getByText(/run_2/).closest('.version-card');
    fireEvent.click(run2Card);

    // Should show metrics comparison
    expect(screen.getByText('Output Score')).toBeInTheDocument();
    expect(screen.getByText('Relevancy Score')).toBeInTheDocument();
  });

  it('should calculate and display percentage differences', () => {
    render(<QuestionComparison {...defaultProps} />);

    // Select run_2
    const run2Card = screen.getByText(/run_2/).closest('.version-card');
    fireEvent.click(run2Card);

    // Should display percentage differences
    // run_1 output_score: 0.95, run_2 output_score: 0.90
    // Difference: -5.26% approximately
    expect(screen.getByText(/-5\.3%/)).toBeInTheDocument();
  });

  it('should filter versions by search text', () => {
    render(<QuestionComparison {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'run_2' } });

    expect(screen.queryByText(/run_1/)).not.toBeInTheDocument();
    expect(screen.getByText(/run_2/)).toBeInTheDocument();
  });

  it('should sort versions by timestamp', () => {
    render(<QuestionComparison {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue(/timestamp/i);
    expect(sortSelect).toBeInTheDocument();

    // Versions should be sorted by timestamp (most recent first by default)
    const versionCards = screen.getAllByText(/run_/);
    expect(versionCards[0].textContent).toContain('run_2'); // More recent
    expect(versionCards[1].textContent).toContain('run_1'); // Older
  });

  it('should export comparison to JSON', () => {
    // Mock download functionality
    const createObjectURL = vi.fn();
    global.URL.createObjectURL = createObjectURL;
    const mockLink = document.createElement('a');
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    const clickSpy = vi.spyOn(mockLink, 'click');

    render(<QuestionComparison {...defaultProps} />);

    const exportButton = screen.getByText(/Export JSON/i);
    fireEvent.click(exportButton);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });

  it('should export comparison to CSV', () => {
    const createObjectURL = vi.fn();
    global.URL.createObjectURL = createObjectURL;
    const mockLink = document.createElement('a');
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    const clickSpy = vi.spyOn(mockLink, 'click');

    render(<QuestionComparison {...defaultProps} />);

    const exportButton = screen.getByText(/Export CSV/i);
    fireEvent.click(exportButton);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });

  it('should call onClose when close button is clicked', () => {
    render(<QuestionComparison {...defaultProps} />);

    const closeButton = screen.getByTitle(/Close/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle missing metrics gracefully', () => {
    const runsWithMissingMetrics = [
      {
        id: 1,
        version: 'run_1',
        runs: [
          {
            id: 'exec1',
            input: 'Test question',
            output_score: { value: 0.95, reason: 'Excellent' }
            // Missing relevancy_score
          }
        ]
      }
    ];

    render(<QuestionComparison {...defaultProps} allRuns={runsWithMissingMetrics} />);

    expect(screen.getByText('Test question')).toBeInTheDocument();
  });
});
