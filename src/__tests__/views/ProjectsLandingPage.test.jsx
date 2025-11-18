import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectsLandingPage from '../../views/ProjectsLandingPage';

describe('ProjectsLandingPage', () => {
  const mockOnSelectProject = vi.fn();
  const mockOnCreateProject = vi.fn();

  const mockProjects = [
    {
      id: 1,
      name: 'Test Project 1',
      description: 'Description 1',
      workflowCount: 5,
      createdAt: '2025-01-01T10:00:00',
      updatedAt: '2025-01-02T10:00:00'
    },
    {
      id: 2,
      name: 'Test Project 2',
      description: 'Description 2',
      workflowCount: 3,
      createdAt: '2025-01-03T10:00:00',
      updatedAt: '2025-01-04T10:00:00'
    }
  ];

  const defaultProps = {
    projects: mockProjects,
    onSelectProject: mockOnSelectProject,
    onCreateProject: mockOnCreateProject
  };

  beforeEach(() => {
    mockOnSelectProject.mockClear();
    mockOnCreateProject.mockClear();
  });

  it('should render projects list', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    expect(screen.getByText('2 Projects')).toBeInTheDocument();
    expect(screen.getByText('8 Total Workflows')).toBeInTheDocument();
  });

  it('should filter projects by search query', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'Project 1' } });

    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });

  it('should search in project descriptions', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'Description 2' } });

    expect(screen.queryByText('Test Project 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
  });

  it('should call onSelectProject when project card is clicked', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    const projectCard = screen.getByText('Test Project 1').closest('.project-card');
    fireEvent.click(projectCard);

    expect(mockOnSelectProject).toHaveBeenCalledWith(mockProjects[0]);
  });

  it('should open create project modal', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    const createButton = screen.getByText('Create New Project');
    fireEvent.click(createButton);

    expect(screen.getByText('Create New Project', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter project name')).toBeInTheDocument();
  });

  it('should create new project with valid data', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    // Open modal
    fireEvent.click(screen.getByText('Create New Project'));

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter project name'), {
      target: { value: 'New Project' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter project description (optional)'), {
      target: { value: 'New Description' }
    });

    // Submit
    const createButtons = screen.getAllByText('Create Project');
    fireEvent.click(createButtons[1]); // Second one is in the modal

    expect(mockOnCreateProject).toHaveBeenCalledWith({
      name: 'New Project',
      description: 'New Description'
    });
  });

  it('should not create project with empty name', () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ProjectsLandingPage {...defaultProps} />);

    // Open modal
    fireEvent.click(screen.getByText('Create New Project'));

    // Try to submit without name
    const createButtons = screen.getAllByText('Create Project');
    fireEvent.click(createButtons[1]);

    expect(alertMock).toHaveBeenCalledWith('Please enter a project name');
    expect(mockOnCreateProject).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  it('should sort projects by name ascending', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Created Date');
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    const projectCards = screen.getAllByText(/Test Project/);
    expect(projectCards[0].textContent).toBe('Test Project 1');
    expect(projectCards[1].textContent).toBe('Test Project 2');
  });

  it('should sort projects by workflow count', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    const sortSelect = screen.getByDisplayValue('Created Date');
    fireEvent.change(sortSelect, { target: { value: 'workflowCount' } });

    // Should be sorted by workflow count (descending by default for counts)
    const projectCards = screen.getAllByText(/Test Project/);
    expect(projectCards[0].textContent).toBe('Test Project 1'); // 5 workflows
    expect(projectCards[1].textContent).toBe('Test Project 2'); // 3 workflows
  });

  it('should toggle sort direction', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    const toggleButton = screen.getByTitle(/Toggle sort/);
    fireEvent.click(toggleButton);

    // Projects should be in reverse order
    const projectCards = screen.getAllByText(/Test Project/);
    expect(projectCards[0].textContent).toBe('Test Project 1');
  });

  it('should show "1 Project" when only one project', () => {
    const singleProject = [mockProjects[0]];
    render(<ProjectsLandingPage {...defaultProps} projects={singleProject} />);

    expect(screen.getByText('1 Project')).toBeInTheDocument();
  });

  it('should handle empty projects list', () => {
    render(<ProjectsLandingPage {...defaultProps} projects={[]} />);

    expect(screen.getByText('0 Projects')).toBeInTheDocument();
    expect(screen.getByText('0 Total Workflows')).toBeInTheDocument();
  });

  it('should close create modal when cancel is clicked', () => {
    render(<ProjectsLandingPage {...defaultProps} />);

    // Open modal
    fireEvent.click(screen.getByText('Create New Project'));
    expect(screen.getByText('Create New Project', { selector: 'h2' })).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Create New Project', { selector: 'h2' })).not.toBeInTheDocument();
  });
});
