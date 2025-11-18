import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentViewer from '../../components/ContentViewer';

describe('ContentViewer', () => {
  const mockOnClose = vi.fn();

  const defaultProps = {
    title: 'Test Content',
    content: 'This is test content',
    runId: '123',
    gtId: '456',
    onClose: mockOnClose
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should render with title and content', () => {
    render(<ContentViewer {...defaultProps} />);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('This is test content')).toBeInTheDocument();
    expect(screen.getByText(/Run ID: 123/)).toBeInTheDocument();
    expect(screen.getByText(/GT ID: 456/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<ContentViewer {...defaultProps} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when content is clicked', () => {
    render(<ContentViewer {...defaultProps} />);

    const content = screen.getByText('This is test content');
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render long content correctly', () => {
    const longContent = 'Lorem ipsum '.repeat(100);
    render(<ContentViewer {...defaultProps} content={longContent} />);

    // Check if content container exists and contains the text (partial match)
    const viewer = screen.getByText(/Lorem ipsum/, { exact: false });
    expect(viewer).toBeInTheDocument();
    expect(viewer.textContent).toBe(longContent);
  });

  it('should handle content without runId or gtId', () => {
    render(<ContentViewer title="Test" content="Content" onClose={mockOnClose} />);

    expect(screen.getByText(/Run ID: N\/A/)).toBeInTheDocument();
    expect(screen.queryByText(/GT ID:/)).not.toBeInTheDocument();
  });

  it('should return null when no content is provided', () => {
    const { container } = render(<ContentViewer title="Test" content={null} onClose={mockOnClose} />);

    expect(container.firstChild).toBeNull();
  });
});
