import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddItemDialog } from '@/components/add-item-dialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock PointerEvent methods for Radix UI
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.setPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('AddItemDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnAddItem = vi.fn();
  const categories = ['food', 'home'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the trigger button', () => {
    render(
      <AddItemDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        categories={categories}
        onAddItem={mockOnAddItem}
      />
    );

    expect(screen.getByRole('button', { name: /agregar item/i })).toBeDefined();
  });

  it('opens the dialog when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AddItemDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        categories={categories}
        onAddItem={mockOnAddItem}
      />
    );

    const trigger = screen.getByRole('button', { name: /agregar item/i });
    await user.click(trigger);

    expect(mockOnOpenChange).toHaveBeenCalledWith(true);
  });

  it('calls onAddItem when form is submitted', async () => {
    const user = userEvent.setup();
    mockOnAddItem.mockResolvedValue(undefined);

    render(
      <AddItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        categories={categories}
        onAddItem={mockOnAddItem}
      />
    );

    // Dialog content should be visible
    expect(await screen.findByText('Agregar Item a la Lista')).toBeDefined();

    // Fill form
    const titleInput = screen.getByLabelText(/nombre del producto/i);
    const quantityInput = screen.getByLabelText(/cantidad/i);
    const categoryTrigger = screen.getByLabelText(/Categoría/i);

    await user.type(titleInput, 'Milk');

    // Select category
    await user.click(categoryTrigger);
    const categoryOption = await screen.findByRole('option', { name: /Food/i });
    await user.click(categoryOption);

    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    // Submit
    const submitButton = screen.getByRole('button', { name: /agregar a la lista/i });
    await user.click(submitButton);

    expect(mockOnAddItem).toHaveBeenCalledWith({
      title: 'Milk',
      category: 'food',
      quantity: '2',
    });
  });
});
