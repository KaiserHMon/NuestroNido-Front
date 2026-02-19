import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalendarSection } from '@/components/calendar-section';
import { TaskService } from '@/services/task-service';
import { useAuth } from '@/hooks/use-auth';
import { useFamily } from '@/hooks/use-family';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock services and hooks
vi.mock('@/services/task-service', () => ({
  TaskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

vi.mock('@/hooks/use-auth');
vi.mock('@/hooks/use-family');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock child components to avoid complexity
vi.mock('@/components/dialogs/create-task-dialog', () => ({
  CreateTaskDialog: ({
    open,
    onSubmit,
    onOpenChange,
  }: {
    open: boolean;
    onSubmit: (data: unknown) => void;
    onOpenChange: (open: boolean) => void;
  }) => {
    if (!open) return null;
    return (
      <div data-testid="create-task-dialog">
        <button
          data-testid="submit-task-btn"
          onClick={() => {
            onSubmit({
              title: 'Test Task',
              dateType: 'date',
              date: new Date('2023-10-10T12:00:00.000Z'),
              recurrence: 'once',
              assignedTo: 'user1',
            });
          }}
        >
          Submit Task
        </button>
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    );
  },
}));

vi.mock('@/components/tasks-tab', () => ({
  TasksTab: () => <div data-testid="tasks-tab" />,
}));

vi.mock('@/components/expanded-date-modal', () => ({
  ExpandedDateModal: () => <div data-testid="expanded-date-modal" />,
}));

// Mock UI components that might cause issues in JSDOM or are not relevant for this test
vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('CalendarSection', () => {
  const mockUser = { id: 'user1', name: 'User 1' };
  const mockFamily = {
    id: 'family1',
    members: [{ id: 'user1', name: 'User 1', color: { bg: 'red' } }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({ user: mockUser } as any);
    vi.mocked(useFamily).mockReturnValue({ family: mockFamily, refreshFamily: vi.fn() } as any);
    vi.mocked(TaskService.getTasks).mockResolvedValue([]);
  });

  it('calls TaskService.createTask with correct arguments when a new task is created', async () => {
    render(<CalendarSection />);

    // Click "Nueva Tarea" button
    const newButton = await screen.findByText('Nueva Tarea');
    fireEvent.click(newButton);

    // Dialog should open
    expect(screen.getByTestId('create-task-dialog')).toBeInTheDocument();

    // Click submit in mock dialog
    const submitBtn = screen.getByTestId('submit-task-btn');
    fireEvent.click(submitBtn);

    // Verify TaskService.createTask call
    await waitFor(() => {
      expect(TaskService.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          family_id: 'family1',
          assigned_to_user_id: 'user1',
          recurrence_type: 'none',
          status: 'pending',
          due_date: '2023-10-10T12:00:00.000Z',
        })
      );
    });
  });
});
