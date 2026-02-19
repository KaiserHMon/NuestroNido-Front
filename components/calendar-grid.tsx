import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ColorDot {
  bg: string;
  name: string;
}

interface CalendarGridProps {
  daysInMonth: Date[];
  startOffset: number;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  getColorsForDay: (date: Date) => ColorDot[];
}

export function CalendarGrid({
  daysInMonth,
  startOffset,
  selectedDate,
  onSelectDate,
  getColorsForDay,
}: CalendarGridProps) {
  // Use useMemo to avoid recalculating these arrays on every render unless the props change
  // Although daysInMonth is already memoized in the parent, creating empty arrays is cheap.
  // We can just iterate directly.

  return (
    <>
      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((dia) => (
          <div
            key={dia}
            className="text-center text-xs font-semibold text-muted-foreground p-1"
          >
            {dia}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-12 sm:h-14 rounded-sm p-1 bg-muted/20"
          />
        ))}
        {daysInMonth.map((day) => {
          const dayColors = getColorsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const hasEvents = dayColors.length > 0;
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                'min-h-[48px] sm:h-28 rounded-md transition-all relative flex flex-col items-center sm:items-start justify-center sm:justify-start p-1 sm:p-2 border',
                isSelected
                  ? 'border-primary ring-1 ring-primary bg-primary/10 scale-[1.02] z-10'
                  : isToday
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-transparent sm:border-border hover:bg-muted/50',
                hasEvents && !isSelected && 'sm:bg-primary/5'
              )}
            >
              <div
                className={cn(
                  'text-sm sm:text-xs font-bold Gabriel leading-none mb-1',
                  isToday ? 'text-primary' : 'text-foreground',
                  isSelected && 'text-primary'
                )}
              >
                {format(day, 'd')}
              </div>
              {hasEvents ? (
                <div className="flex flex-wrap gap-0.5 sm:gap-1 mt-auto sm:mt-1 w-full justify-center sm:justify-start overflow-hidden">
                  {dayColors.slice(0, 4).map((color, idx) => (
                    <div
                      key={`${color.bg}-${idx}`}
                      className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color.bg }}
                    />
                  ))}
                  {dayColors.length > 4 ? (
                    <span className="text-[8px] sm:text-[10px] text-muted-foreground leading-none self-center font-bold">
                      +
                    </span>
                  ) : null}
                </div>
              ) : (
                <div className="h-1.5 sm:h-2.5" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
