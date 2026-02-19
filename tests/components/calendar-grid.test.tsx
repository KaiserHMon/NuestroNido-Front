import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarGrid, ColorDot } from '@/components/calendar-grid';
import { describe, it, expect, vi } from 'vitest';
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

describe('CalendarGrid', () => {
  // October 2023 starts on Sunday (0) and has 31 days.
  const currentMonth = new Date(2023, 9, 1);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = monthStart.getDay();

  const mockOnSelectDate = vi.fn();
  const mockGetColorsForDay = vi.fn((date: Date) => {
    if (date.getDate() === 10) {
      return [{ bg: 'red', name: 'Task 1' }];
    }
    return [] as ColorDot[];
  });

  it('renders headers and days correctly', () => {
    render(
      <CalendarGrid
        daysInMonth={daysInMonth}
        startOffset={startOffset}
        selectedDate={null}
        onSelectDate={mockOnSelectDate}
        getColorsForDay={mockGetColorsForDay}
      />
    );

    // Check headers
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();

    // Check days
    // October 2023 has 31 days.
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(31);

    // Check specific day content
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
  });

  it('renders empty cells correctly', () => {
    // Use a month that doesn't start on Sunday to verify empty cells
    // November 2023 starts on Wednesday (3)
    const nov2023 = new Date(2023, 10, 1);
    const novStart = startOfMonth(nov2023);
    const novEnd = endOfMonth(nov2023);
    const novDays = eachDayOfInterval({ start: novStart, end: novEnd });
    const novOffset = novStart.getDay(); // 3

    const { container } = render(
      <CalendarGrid
        daysInMonth={novDays}
        startOffset={novOffset}
        selectedDate={null}
        onSelectDate={mockOnSelectDate}
        getColorsForDay={mockGetColorsForDay}
      />
    );

    // Empty cells have key starting with 'empty-'
    // But keys are not in DOM.
    // They have class 'bg-muted/20'.
    // We can query by class name or verify structure.

    // However, testing-library discourages querying by class.
    // Let's check the number of divs inside the second grid container.
    // The second grid container has class 'grid grid-cols-7 gap-0.5'.

    // Actually, we can just count total children of the grid container.
    // 3 empty cells + 30 days = 33 children.

    // We can access container.
    const gridContainers = container.querySelectorAll('.grid-cols-7');
    // The first one is headers (length 7). The second one is days.
    expect(gridContainers).toHaveLength(2);
    const daysGrid = gridContainers[1];
    expect(daysGrid.children).toHaveLength(novOffset + novDays.length);
  });

  it('calls onSelectDate when a day is clicked', () => {
    render(
      <CalendarGrid
        daysInMonth={daysInMonth}
        startOffset={startOffset}
        selectedDate={null}
        onSelectDate={mockOnSelectDate}
        getColorsForDay={mockGetColorsForDay}
      />
    );

    // Find the button for day 15 (using text match, exact: false to avoid issues with potential nested elements, though text is direct child)
    // Actually the text '15' is inside a div inside the button.
    const day15Text = screen.getByText('15');
    const day15Button = day15Text.closest('button');

    expect(day15Button).toBeInTheDocument();
    fireEvent.click(day15Button!);

    expect(mockOnSelectDate).toHaveBeenCalled();
    // Verify the argument passed is correct (can be tricky with Date object equality, but date-fns handles it)
    // We can check if the call argument date is the 15th.
    const calledDate = mockOnSelectDate.mock.calls[0][0];
    expect(calledDate.getDate()).toBe(15);
  });

  it('renders event dots', () => {
    render(
      <CalendarGrid
        daysInMonth={daysInMonth}
        startOffset={startOffset}
        selectedDate={null}
        onSelectDate={mockOnSelectDate}
        getColorsForDay={mockGetColorsForDay}
      />
    );

    // Day 10 has an event (mocked).
    // The dot is a div with specific background color.
    // We can try to find the button for day 10 and check its children.
    const day10Text = screen.getByText('10');
    const day10Button = day10Text.closest('button');

    // Check if it contains a div with style backgroundColor: red
    // We can query selector inside the button
    const dot = day10Button?.querySelector('div[style*="background-color: red"]');
    expect(dot).toBeInTheDocument();
  });
});
