import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavigationSidebar from '../../components/NavigationSidebar';

describe('NavigationSidebar', () => {
  const mockOnNavigate = vi.fn();

  const mockProject = {
    id: 1,
    name: 'Test Project',
    workflows: [
      {
        id: 'RE_Butler',
        name: 'RE Butler',
        runs: [
          { id: 1, version: 'run_1' },
          { id: 2, version: 'run_2' }
        ]
      },
      {
        id: 'RAG_Search',
        name: 'RAG Search',
        runs: [
          { id: 3, version: 'run_3' }
        ]
      }
    ]
  };

  const defaultProps = {
    project: mockProject,
    selectedWorkflow: null,
    selectedRun: null,
    onNavigate: mockOnNavigate,
    isExpanded: true
  };

  beforeEach(() => {
    mockOnNavigate.mockClear();
  });

  it('should render project name', () => {
    render(<NavigationSidebar {...defaultProps} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('should render all workflows', () => {
    render(<NavigationSidebar {...defaultProps} />);

    expect(screen.getByText('RE Butler')).toBeInTheDocument();
    expect(screen.getByText('RAG Search')).toBeInTheDocument();
  });

  it('should show workflow run counts', () => {
    render(<NavigationSidebar {...defaultProps} />);

    expect(screen.getByText('2')).toBeInTheDocument(); // RE Butler has 2 runs
    expect(screen.getByText('1')).toBeInTheDocument(); // RAG Search has 1 run
  });

  it('should call onNavigate when project is clicked', () => {
    render(<NavigationSidebar {...defaultProps} />);

    const projectButton = screen.getByText('Test Project');
    fireEvent.click(projectButton);

    expect(mockOnNavigate).toHaveBeenCalledWith('projects', null, null, null, null);
  });

  it('should call onNavigate when workflow is clicked', () => {
    render(<NavigationSidebar {...defaultProps} />);

    const workflowButton = screen.getByText('RE Butler');
    fireEvent.click(workflowButton);

    expect(mockOnNavigate).toHaveBeenCalledWith(
      'workflow',
      mockProject,
      mockProject.workflows[0],
      null,
      null
    );
  });

  it('should expand workflow to show runs when clicked', () => {
    render(<NavigationSidebar {...defaultProps} />);

    const expandButton = screen.getAllByTitle(/Expand|Collapse/)[0];
    fireEvent.click(expandButton);

    // Runs should be visible
    expect(screen.getByText('run_1')).toBeInTheDocument();
    expect(screen.getByText('run_2')).toBeInTheDocument();
  });

  it('should highlight selected workflow', () => {
    const props = {
      ...defaultProps,
      selectedWorkflow: mockProject.workflows[0]
    };

    render(<NavigationSidebar {...props} />);

    const workflowButton = screen.getByText('RE Butler').closest('.sidebar-item');
    expect(workflowButton).toHaveClass('active');
  });

  it('should highlight selected run', () => {
    const props = {
      ...defaultProps,
      selectedWorkflow: mockProject.workflows[0],
      selectedRun: mockProject.workflows[0].runs[0]
    };

    render(<NavigationSidebar {...props} />);

    // First expand the workflow
    const expandButton = screen.getAllByTitle(/Expand|Collapse/)[0];
    fireEvent.click(expandButton);

    const runButton = screen.getByText('run_1').closest('.sidebar-item');
    expect(runButton).toHaveClass('active');
  });

  it('should collapse when expanded and clicked', () => {
    render(<NavigationSidebar {...defaultProps} />);

    // Expand
    const expandButton = screen.getAllByTitle(/Expand|Collapse/)[0];
    fireEvent.click(expandButton);
    expect(screen.getByText('run_1')).toBeInTheDocument();

    // Collapse
    fireEvent.click(expandButton);
    expect(screen.queryByText('run_1')).not.toBeInTheDocument();
  });

  it('should render in collapsed state when isExpanded is false', () => {
    const props = {
      ...defaultProps,
      isExpanded: false
    };

    render(<NavigationSidebar {...props} />);

    const sidebar = screen.getByText('Test Project').closest('.navigation-sidebar');
    expect(sidebar).toHaveClass('collapsed');
  });

  it('should handle empty workflows list', () => {
    const props = {
      ...defaultProps,
      project: {
        ...mockProject,
        workflows: []
      }
    };

    render(<NavigationSidebar {...props} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.queryByText('RE Butler')).not.toBeInTheDocument();
  });
});
