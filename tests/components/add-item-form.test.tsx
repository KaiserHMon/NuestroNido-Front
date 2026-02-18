import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddItemForm } from '@/components/add-item-form';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/lib/category-utils', () => ({
  getCategoryIcon: vi.fn(() => (props: React.ComponentProps<'svg'>) => <svg data-testid="category-icon" {...props} />),
  getCategoryLabel: vi.fn((cat: string) => `Label for ${cat}`),
}));

// Mock ResizeObserver for Select component
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('AddItemForm', () => {
  const mockOnAddItem = vi.fn();
  const mockCategories = ['food', 'home'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AddItemForm categories={mockCategories} onAddItem={mockOnAddItem} />);
    expect(screen.getByLabelText(/nombre del producto/i)).toBeInTheDocument();
    // Select trigger uses aria-labelledby or aria-label usually, let's check carefully
    // Radix UI Select trigger might not have label association directly on the trigger button sometimes?
    // But let's assume it works or use getByRole('combobox')
    expect(screen.getByLabelText(/cantidad/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar a la lista/i })).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    const user = userEvent.setup();
    render(<AddItemForm categories={mockCategories} onAddItem={mockOnAddItem} />);

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Milk');
    await user.click(screen.getByRole('button', { name: /agregar a la lista/i }));

    expect(mockOnAddItem).toHaveBeenCalledWith({
      title: 'Milk',
      category: 'food', // Default first category
      quantity: '1',
    });
  });

  it('disables submit button when title is empty', () => {
    render(<AddItemForm categories={mockCategories} onAddItem={mockOnAddItem} />);
    const submitButton = screen.getByRole('button', { name: /agregar a la lista/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows loading state when submitting', async () => {
    const user = userEvent.setup();
    // Mock onAddItem to never resolve immediately to check loading state
    let resolvePromise: (value: void | PromiseLike<void>) => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    mockOnAddItem.mockReturnValue(promise);

    render(<AddItemForm categories={mockCategories} onAddItem={mockOnAddItem} />);

    await user.type(screen.getByLabelText(/nombre del producto/i), 'Milk');
    await user.click(screen.getByRole('button', { name: /agregar a la lista/i }));

    const submitButton = screen.getByRole('button', { name: /agregando/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/agregando.../i)).toBeInTheDocument();

    // Resolve promise to avoid hanging test
    resolvePromise!();
  });
});
