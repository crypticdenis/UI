import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkflowsOverview from '../../views/WorkflowsOverview';

describe('WorkflowsOverview', () => {
  const mockOnSelectWorkflow = vi.fn();
  const mockOnBack = vi.fn();

  const mockWorkflows = [
    {
      id: 'RE_Butler',
      name: 'RE Butler',
      description: 'Butler workflow',
      runCount: 10,
      createdAt: '2025-01-01T10:00:00'
    },
    {
      id: 'RAG_Search',
      name: 'RAG Search',
      description: 'Search workflow',
      runCount: 5,
      createdAt: '2025-01-02T10:00:00'
    }
  ];

  const defaultProps = {
    workflows: mockWorkflows,
    projectName: 'Test Project',
    onSelectWorkflow: mockOnSelectWorkflow,
    onBack: mockOnBack
  };

  beforeEach(() => {
    mockOnSelectWorkflow.mockClear();
    mockOnBack.mockClear();
  });

  it('should render workflows list', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    expect(screen.getByText('RE Butler')).toBeInTheDocument();
    expect(screen.getByText('RAG Search')).toBeInTheDocument();
    expect(screen.getByText('Workflows in Test Project')).toBeInTheDocument();
    expect(screen.getByText('2 Workflows')).toBeInTheDocument();
  });

  it('should show breadcrumb navigation', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('should call onBack when Projects breadcrumb is clicked', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    const backButton = screen.getByText('Projects');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should filter workflows by search query', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search workflows...');
    fireEvent.change(searchInput, { target: { value: 'Butler' } });

    expect(screen.getByText('RE Butler')).toBeInTheDocument();
    expect(screen.queryByText('RAG Search')).not.toBeInTheDocument();
  });

  it('should search in workflow descriptions', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search workflows...');
    fireEvent.change(searchInput, { target: { value: 'Search workflow' } });

    expect(screen.queryByText('RE Butler')).not.toBeInTheDocument();
    expect(screen.getByText('RAG Search')).toBeInTheDocument();
  });

  it('should clear search when clear button is clicked', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search workflows...');
    fireEvent.change(searchInput, { target: { value: 'Butler' } });

    expect(screen.queryByText('RAG Search')).not.toBeInTheDocument();

    const clearButton = screen.getByTitle('Clear search');
    fireEvent.click(clearButton);

    expect(searchInput.value).toBe('');
    expect(screen.getByText('RAG Search')).toBeInTheDocument();
  });

  it('should call onSelectWorkflow when workflow card is clicked', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    const workflowCard = screen.getByText('RE Butler').closest('.workflow-card');
    fireEvent.click(workflowCard);

    expect(mockOnSelectWorkflow).toHaveBeenCalledWith(mockWorkflows[0]);
  });

  it('should sort workflows by name', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    // Default sort is by name ascending
    const workflowCards = screen.getAllByText(/Butler|Search/);
    expect(workflowCards[0].textContent).toContain('RAG Search');
    expect(workflowCards[1].textContent).toContain('RE Butler');
  });

  it('should toggle sort direction', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    const toggleButton = screen.getByTitle(/Toggle sort/);
    fireEvent.click(toggleButton);

    // Should reverse order
    const workflowCards = screen.getAllByText(/Butler|Search/);
    expect(workflowCards[0].textContent).toContain('RE Butler');
    expect(workflowCards[1].textContent).toContain('RAG Search');
  });

  it('should show "1 Workflow" when only one workflow', () => {
    const singleWorkflow = [mockWorkflows[0]];
    render(<WorkflowsOverview {...defaultProps} workflows={singleWorkflow} />);

    expect(screen.getByText('1 Workflow')).toBeInTheDocument();
  });

  it('should handle empty workflows list', () => {
    render(<WorkflowsOverview {...defaultProps} workflows={[]} />);

    expect(screen.getByText('0 Workflows')).toBeInTheDocument();
    expect(screen.getByText('No workflows found')).toBeInTheDocument();
  });

  it('should display run count for each workflow', () => {
    render(<WorkflowsOverview {...defaultProps} />);

    expect(screen.getByText('10 Runs')).toBeInTheDocument();
    expect(screen.getByText('5 Runs')).toBeInTheDocument();
  });
});
