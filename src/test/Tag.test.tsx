import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Tag } from '@/components/ui/Tag';

describe('Tag Component', () => {
  it('renders tag label correctly', () => {
    render(<Tag label="Python" />);
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const handleRemove = vi.fn();
    render(<Tag label="React" onRemove={handleRemove} />);

    const removeBtn = screen.getByRole('button', { name: /remove react/i });
    await userEvent.click(removeBtn);

    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when tag is clicked', async () => {
    const handleClick = vi.fn();
    render(<Tag label="Selectable Skill" onClick={handleClick} />);

    const tag = screen.getByRole('button', { name: /selectable skill/i });
    await userEvent.click(tag);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation via Enter and Space', () => {
    const handleClick = vi.fn();
    render(<Tag label="Keyboard Tag" onClick={handleClick} />);

    const tag = screen.getByRole('button', { name: /keyboard tag/i });

    fireEvent.keyDown(tag, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(tag, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('shows selected style when selected is true', () => {
    render(<Tag label="Selected Tag" selected onClick={() => {}} />);
    const tag = screen.getByRole('button');
    expect(tag).toHaveAttribute('aria-pressed', 'true');
    expect(tag).toHaveClass('bg-indigo-600');
  });

  it('renders leading icon', () => {
    render(
      <Tag
        label="Icon Tag"
        icon={<span data-testid="tag-icon">⚡</span>}
      />
    );
    expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
  });

  it('disables interactions when disabled is true', async () => {
    const handleClick = vi.fn();
    const handleRemove = vi.fn();
    render(
      <Tag
        label="Disabled Tag"
        disabled
        onClick={handleClick}
        onRemove={handleRemove}
      />
    );

    const tag = screen.getByText('Disabled Tag');
    await userEvent.click(tag);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
