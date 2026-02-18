import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ListSection } from '@/components/list-section';
import { ListService } from '@/services/list-service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mocks
vi.mock('@/hooks/use-family', () => ({
  useFamily: () => ({
    family: { id: 'family-123', name: 'Test Family' },
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/services/list-service', () => ({
  ListService: {
    getItems: vi.fn(),
    getCategories: vi.fn(),
    delete: vi.fn(),
    deleteBatch: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

describe('ListSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls deleteBatch once for clearPurchased (optimized)', async () => {
    const mockItems = [
      { id: '1', title: 'Item 1', purchased: true, category: 'Food', quantity: 1, created_at: '2023-01-01' },
      { id: '2', title: 'Item 2', purchased: true, category: 'Food', quantity: 1, created_at: '2023-01-01' },
      { id: '3', title: 'Item 3', purchased: false, category: 'Food', quantity: 1, created_at: '2023-01-01' },
    ];
    (ListService.getItems as any).mockResolvedValue(mockItems);
    (ListService.getCategories as any).mockResolvedValue(['Food']);
    (ListService.delete as any).mockResolvedValue(undefined);
    (ListService.deleteBatch as any).mockResolvedValue(undefined);

    render(<ListSection />);

    // Wait for items to load
    await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    // Find "Limpiar Comprados" button
    const clearButton = screen.getByText('Limpiar Comprados');
    fireEvent.click(clearButton);

    // Wait for async operations
    await waitFor(() => {
       expect(ListService.deleteBatch).toHaveBeenCalledTimes(1);
       expect(ListService.deleteBatch).toHaveBeenCalledWith(['1', '2']);
       expect(ListService.delete).toHaveBeenCalledTimes(0);
    });
  });
});
