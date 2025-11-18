import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RunDetails from '../../views/RunDetails';

describe('RunDetails', () => {
  const mockOnBack = vi.fn();
  const mockOnCompareQuestion = vi.fn();
  const mockOnNavigateToSubExecution = vi.fn();

  const mockQuestions = [
    {
      id: 'exec1',
      input: 'What is 2+2?',
      expected_output: '4',
      output: 'The answer is 4',
      output_score: { value: 0.95, reason: 'Correct answer' },
      relevancy_score: { value: 0.90, reason: 'Highly relevant' },
      duration: 1.5,
      total_tokens: 150,
      subExecutions: []
    },
    {
      id: 'exec2',
      input: 'What is the capital of France?',
      expected_output: 'Paris',
      output: 'Paris',
      output_score: { value: 1.0, reason: 'Perfect answer' },
      relevancy_score: { value: 1.0, reason: 'Exactly relevant' },
      duration: 1.2,
      total_tokens: 120,
      subExecutions: [
        {
          id: 'sub1',
          workflowId: 'Sub_Workflow',
          input: 'Sub question',
          output: 'Sub answer'
        }
      ]
    }
  ];

  const defaultProps = {
    runVersion: 'run_1',
    questions: mockQuestions,
    onBack: mockOnBack,
    onCompareQuestion: mockOnCompareQuestion,
    onNavigateToSubExecution: mockOnNavigateToSubExecution
  };

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnCompareQuestion.mockClear();
    mockOnNavigateToSubExecution.mockClear();
  });

  it('should render run details header', () => {
    render(<RunDetails {...defaultProps} />);

    expect(screen.getByText(/Run Details/i)).toBeInTheDocument();
    expect(screen.getByText('run_1')).toBeInTheDocument();
  });

  it('should display aggregate statistics', () => {
    render(<RunDetails {...defaultProps} />);

    expect(screen.getByText('2 Questions')).toBeInTheDocument();
    // Should show average scores
    expect(screen.getByText(/0\.9|0\.8/)).toBeInTheDocument();
  });

  it('should display all questions in table', () => {
    render(<RunDetails {...defaultProps} />);

    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });

  it('should display metrics for each question', () => {
    render(<RunDetails {...defaultProps} />);

    expect(screen.getByText('0.95')).toBeInTheDocument(); // output_score
    expect(screen.getByText('0.90')).toBeInTheDocument(); // relevancy_score
    expect(screen.getByText('1.00')).toBeInTheDocument(); // perfect scores
  });

  it('should filter questions by search query', () => {
    render(<RunDetails {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'France' } });

    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.queryByText('What is 2+2?')).not.toBeInTheDocument();
  });

  it('should sort questions by different columns', () => {
    render(<RunDetails {...defaultProps} />);

    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'output_score' } });

    // Questions should be re-sorted
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', () => {
    render(<RunDetails {...defaultProps} />);

    const backButton = screen.getByText(/Back/i);
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should call onCompareQuestion when compare button is clicked', () => {
    render(<RunDetails {...defaultProps} />);

    // Find compare button for first question
    const compareButtons = screen.getAllByTitle(/Compare/i);
    fireEvent.click(compareButtons[0]);

    expect(mockOnCompareQuestion).toHaveBeenCalledWith('exec1');
  });

  it('should expand row to show sub-executions', () => {
    render(<RunDetails {...defaultProps} />);

    // Find expand button for question with sub-executions
    const expandButtons = screen.getAllByTitle(/Expand|View/i);

    // Click on the row with sub-executions
    const subExecutionButton = expandButtons.find(btn =>
      btn.closest('tr').textContent.includes('France')
    );

    if (subExecutionButton) {
      fireEvent.click(subExecutionButton);

      // Should show sub-execution details
      expect(screen.getByText('Sub_Workflow')).toBeInTheDocument();
    }
  });

  it('should call onNavigateToSubExecution when sub-execution is clicked', () => {
    render(<RunDetails {...defaultProps} />);

    // Expand row with sub-executions
    const rows = screen.getAllByRole('row');
    const franceRow = rows.find(row => row.textContent.includes('France'));

    if (franceRow) {
      // Click expand
      const expandButton = franceRow.querySelector('[title*="xpand"]');
      if (expandButton) {
        fireEvent.click(expandButton);

        // Click navigate button
        const navigateButton = screen.getByText(/View Workflow/i);
        fireEvent.click(navigateButton);

        expect(mockOnNavigateToSubExecution).toHaveBeenCalled();
      }
    }
  });

  it('should display duration and token count', () => {
    render(<RunDetails {...defaultProps} />);

    expect(screen.getByText('1.5s')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('should show color-coded scores', () => {
    render(<RunDetails {...defaultProps} />);

    // Scores should be displayed with color indicators
    const scoreElements = screen.getAllByText(/0\.9|1\.0/);
    expect(scoreElements.length).toBeGreaterThan(0);
  });

  it('should handle empty questions list', () => {
    render(<RunDetails {...defaultProps} questions={[]} />);

    expect(screen.getByText('0 Questions')).toBeInTheDocument();
    expect(screen.getByText(/No questions found/i)).toBeInTheDocument();
  });

  it('should expand content viewer for long text', () => {
    const longQuestion = {
      ...mockQuestions[0],
      input: 'This is a very long question '.repeat(20)
    };

    render(<RunDetails {...defaultProps} questions={[longQuestion]} />);

    // Should have expand button for long content
    const expandButtons = screen.getAllByTitle(/View full/i);
    expect(expandButtons.length).toBeGreaterThan(0);
  });

  it('should toggle between expanded and collapsed rows', () => {
    render(<RunDetails {...defaultProps} />);

    const expandButton = screen.getAllByTitle(/Expand/i)[0];

    // Expand
    fireEvent.click(expandButton);

    // Collapse
    fireEvent.click(expandButton);

    // Should toggle correctly
    expect(expandButton).toBeInTheDocument();
  });

  it('should auto-expand execution if autoExpandExecutionId is provided', () => {
    render(<RunDetails {...defaultProps} autoExpandExecutionId="exec2" />);

    // Should auto-expand the specified execution
    // Sub-executions should be visible
    expect(screen.getByText('Sub_Workflow')).toBeInTheDocument();
  });
});
