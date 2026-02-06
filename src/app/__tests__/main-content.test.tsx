import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MainContent } from '../main-content';

// Mock the child components
vi.mock('@/components/chat/ChatInterface', () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat Interface</div>,
}));

vi.mock('@/components/editor/FileTree', () => ({
  FileTree: () => <div data-testid="file-tree">File Tree</div>,
}));

vi.mock('@/components/editor/CodeEditor', () => ({
  CodeEditor: () => <div data-testid="code-editor">Code Editor</div>,
}));

vi.mock('@/components/preview/PreviewFrame', () => ({
  PreviewFrame: () => <div data-testid="preview-frame">Preview Frame</div>,
}));

vi.mock('@/components/HeaderActions', () => ({
  HeaderActions: () => <div data-testid="header-actions">Header Actions</div>,
}));

vi.mock('@/lib/contexts/file-system-context', () => ({
  FileSystemProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/lib/contexts/chat-context', () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MainContent Toggle Buttons', () => {
  it('should toggle between preview and code views when clicking the toggle buttons', async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    // Find the toggle buttons
    const codeButton = screen.getByRole('tab', { name: /code/i });
    const previewButton = screen.getByRole('tab', { name: /preview/i });

    // Initially should show preview
    expect(previewButton).toHaveAttribute('data-state', 'active');
    expect(codeButton).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByTestId('preview-frame')).toBeVisible();

    // Click the code button
    await user.click(codeButton);

    // Should now show code editor and file tree, preview should be hidden
    expect(codeButton).toHaveAttribute('data-state', 'active');
    expect(previewButton).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByTestId('code-editor')).toBeVisible();
    expect(screen.getByTestId('file-tree')).toBeVisible();

    // Click the preview button to go back
    await user.click(previewButton);

    // Should show preview again, code view should be hidden
    expect(previewButton).toHaveAttribute('data-state', 'active');
    expect(codeButton).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByTestId('preview-frame')).toBeVisible();
  });

  it('should maintain toggle state after multiple clicks', async () => {
    const user = userEvent.setup();
    render(<MainContent />);

    const codeButton = screen.getByRole('tab', { name: /code/i });
    const previewButton = screen.getByRole('tab', { name: /preview/i });

    // Click code multiple times
    await user.click(codeButton);
    await user.click(codeButton);

    // Should still be on code view
    expect(screen.getByTestId('code-editor')).toBeInTheDocument();
    expect(codeButton).toHaveAttribute('data-state', 'active');

    // Click preview multiple times
    await user.click(previewButton);
    await user.click(previewButton);

    // Should still be on preview view
    expect(screen.getByTestId('preview-frame')).toBeInTheDocument();
    expect(previewButton).toHaveAttribute('data-state', 'active');
  });
});
