import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListSection } from '@/components/list-section';
import { ListService } from '@/services/list-service';
import { useFamily } from '@/hooks/use-family';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

// Mock dependencies
vi.mock('@/services/list-service', () => ({
  ListService: {
    getItems: vi.fn(),
    getCategories: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/hooks/use-family', () => ({
  useFamily: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ResizeObserver which is often missing in jsdom but used by some UI libs
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ListSection', () => {
  const mockFamily = { id: 'family-123', name: 'Test Family' };

  beforeEach(() => {
    vi.clearAllMocks();
    (useFamily as Mock).mockReturnValue({
      family: mockFamily,
      isLoading: false,
    });
    (ListService.getItems as Mock).mockResolvedValue([]);
    (ListService.getCategories as Mock).mockResolvedValue(['food', 'home']);
    (ListService.create as Mock).mockResolvedValue({
      id: 'new-1',
      title: 'Milk',
      category: 'food',
      quantity: 2,
      purchased: false,
    });
  });

  it('allows adding a new item via the dialog', async () => {
    const user = userEvent.setup();

    render(<ListSection />);

    // Wait for initial load
    await screen.findByText('Lista de Compras');

    // Open dialog
    const addButton = screen.getByRole('button', { name: /agregar item/i });
    await user.click(addButton);

    // Find inputs
    const titleInput = await screen.findByLabelText(/nombre del producto/i);
    const quantityInput = await screen.findByLabelText(/cantidad/i);

    // Fill form
    await user.type(titleInput, 'Milk');
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');

    // Submit
    const submitButton = screen.getByRole('button', { name: /agregar a la lista/i });
    await user.click(submitButton);

    // Verify API call
    expect(ListService.create).toHaveBeenCalledTimes(1);
    expect(ListService.create).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Milk',
      quantity: 2,
      category: 'food', // Default category
      family_id: 'family-123',
    }));
  });
});
