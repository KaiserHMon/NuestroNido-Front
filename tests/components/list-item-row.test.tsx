import { render, screen, fireEvent } from '@testing-library/react';
import { ListItemRow } from '@/components/list-item-row';
import { ListItem } from '@/services/list-service';
import { describe, it, expect, vi } from 'vitest';

describe('ListItemRow', () => {
  const mockItem: ListItem = {
    id: '1',
    title: 'Milk',
    category: 'food',
    quantity: 2,
    purchased: false,
    family_id: 'fam-1',
    created_at: '2023-01-01',
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders pending item correctly', () => {
    render(<ListItemRow item={mockItem} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('• 2')).toBeInTheDocument();

    // Check toggle button
    const toggleBtn = screen.getByRole('button', { name: /Marcar Milk como comprado/i });
    expect(toggleBtn).toBeInTheDocument();

    // Check delete button
    const deleteBtn = screen.getByRole('button', { name: /Eliminar Milk/i });
    expect(deleteBtn).toBeInTheDocument();
  });

  it('renders purchased item correctly', () => {
    const purchasedItem = { ...mockItem, purchased: true };
    render(<ListItemRow item={purchasedItem} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const title = screen.getByText('Milk');
    expect(title).toHaveClass('line-through');

    const toggleBtn = screen.getByRole('button', { name: /Marcar Milk como no comprado/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it('calls onToggle when toggle button is clicked', () => {
    render(<ListItemRow item={mockItem} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const toggleBtn = screen.getByRole('button', { name: /Marcar Milk como comprado/i });
    fireEvent.click(toggleBtn);
    expect(mockOnToggle).toHaveBeenCalledWith(mockItem);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<ListItemRow item={mockItem} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const deleteBtn = screen.getByRole('button', { name: /Eliminar Milk/i });
    fireEvent.click(deleteBtn);
    expect(mockOnDelete).toHaveBeenCalledWith(mockItem.id);
  });
});
