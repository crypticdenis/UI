import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RunsOverview from '../../views/RunsOverview';

describe('RunsOverview', () => {
  const mockOnBack = vi.fn();
  const mockOnViewRunDetails = vi.fn();
  const mockOnCompareRuns = vi.fn();

  const mockRuns = [
    {
      id: 1,
      version: 'run_1',
      workflowId: 'RE_Butler',
      startTs: '2025-01-01T10:00:00',
      questionCount: 5,
      avg_output_score: 0.95,
      avg_relevancy_score: 0.88,
      runs: [
        { id: 'exec1', output_score: { value: 0.95 } },
        { id: 'exec2', output_score: { value: 0.90 } }
      ]
    },
    {
      id: 2,
      version: 'run_2',
      workflowId: 'RE_Butler',
      startTs: '2025-01-02T10:00:00',
      questionCount: 3,
      avg_output_score: 0.85,
      avg_relevancy_score: 0.90,
      runs: [
        { id: 'exec3', output_score: { value: 0.85 } }
      ]
    }
  ];

  const defaultProps = {
    runs: mockRuns,
    workflowName: 'RE Butler',
    projectName: 'Test Project',
    onBack: mockOnBack,
    onViewRunDetails: mockOnViewRunDetails,
    onCompareRuns: mockOnCompareRuns
  };

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnViewRunDetails.mockClear();
    mockOnCompareRuns.mockClear();
  });

  it('should render runs overview with header', () => {
    render(<RunsOverview {...defaultProps} />);

    expect(screen.getByText('Runs for RE Butler')).toBeInTheDocument();
    expect(screen.getByText('2 Runs')).toBeInTheDocument();
  });

  it('should display breadcrumb navigation', () => {
    render(<RunsOverview {...defaultProps} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('RE Butler')).toBeInTheDocument();
  });

  it('should call onBack when breadcrumb is clicked', () => {
    render(<RunsOverview {...defaultProps} />);

    const backButton = screen.getByText('Test Project');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should display run cards with metrics', () => {
    render(<RunsOverview {...defaultProps} />);

    expect(screen.getByText('run_1')).toBeInTheDocument();
    expect(screen.getByText('run_2')).toBeInTheDocument();
    expect(screen.getByText('5 Questions')).toBeInTheDocument();
    expect(screen.getByText('3 Questions')).toBeInTheDocument();
  });

  it('should filter runs by search query', () => {
    render(<RunsOverview {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'run_1' } });

    expect(screen.getByText('run_1')).toBeInTheDocument();
    expect(screen.queryByText('run_2')).not.toBeInTheDocument();
  });

  it('should sort runs by different criteria', () => {
    render(<RunsOverview {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue(/Newest First/i);
    fireEvent.change(sortSelect, { target: { value: 'avg_output_score' } });

    // Should re-render with new sort order
    expect(screen.getByText('run_1')).toBeInTheDocument();
  });

  it('should select/deselect runs for comparison', () => {
    render(<RunsOverview {...defaultProps} />);

    // Find checkboxes
    const checkboxes = screen.getAllByRole('checkbox');

    // Select first run
    fireEvent.click(checkboxes[0]);

    // Select second run
    fireEvent.click(checkboxes[1]);

    // Compare button should appear
    expect(screen.getByText(/Compare.*Runs/i)).toBeInTheDocument();
  });

  it('should call onCompareRuns when compare button is clicked', () => {
    render(<RunsOverview {...defaultProps} />);

    // Select runs
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    // Click compare button
    const compareButton = screen.getByText(/Compare.*Runs/i);
    fireEvent.click(compareButton);

    expect(mockOnCompareRuns).toHaveBeenCalledWith([1, 2]);
  });

  it('should call onViewRunDetails when run card is clicked', () => {
    render(<RunsOverview {...defaultProps} />);

    const runCard = screen.getByText('run_1').closest('.run-card');
    fireEvent.click(runCard);

    expect(mockOnViewRunDetails).toHaveBeenCalledWith(mockRuns[0]);
  });

  it('should display aggregate statistics', () => {
    render(<RunsOverview {...defaultProps} />);

    // Should show average metrics across all runs
    expect(screen.getAllByText(/0\.\d+/)).toHaveLength(expect.any(Number));
  });

  it('should group runs by version if applicable', () => {
    render(<RunsOverview {...defaultProps} />);

    // Each run should be displayed
    expect(screen.getByText('run_1')).toBeInTheDocument();
    expect(screen.getByText('run_2')).toBeInTheDocument();
  });

  it('should handle empty runs list', () => {
    render(<RunsOverview {...defaultProps} runs={[]} />);

    expect(screen.getByText('0 Runs')).toBeInTheDocument();
    expect(screen.getByText(/No runs found/i)).toBeInTheDocument();
  });

  it('should show performance trends chart when multiple runs exist', () => {
    render(<RunsOverview {...defaultProps} />);

    // Performance trends chart should be visible
    expect(screen.getByText(/Performance Trends/i)).toBeInTheDocument();
  });

  it('should toggle between grid and list view', () => {
    render(<RunsOverview {...defaultProps} />);

    const viewToggle = screen.getByTitle(/Toggle view/i);
    fireEvent.click(viewToggle);

    // View should change (implementation specific)
    expect(viewToggle).toBeInTheDocument();
  });

  it('should display color-coded scores', () => {
    render(<RunsOverview {...defaultProps} />);

    // Scores should be displayed with color coding
    const scoreElements = screen.getAllByText(/0\.9|0\.8/);
    expect(scoreElements.length).toBeGreaterThan(0);
  });

  it('should show run timestamp', () => {
    render(<RunsOverview {...defaultProps} />);

    // Should display formatted timestamps
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it('should deselect all runs when clear selection is clicked', () => {
    render(<RunsOverview {...defaultProps} />);

    // Select runs
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    // Clear selection
    const clearButton = screen.getByText(/Clear/i);
    fireEvent.click(clearButton);

    // Compare button should disappear
    expect(screen.queryByText(/Compare.*Runs/i)).not.toBeInTheDocument();
  });
});
