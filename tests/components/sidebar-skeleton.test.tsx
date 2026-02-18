import { render } from '@testing-library/react';
import { SidebarMenuSkeleton } from '@/components/ui/sidebar';
import { describe, it, expect } from 'vitest';

describe('SidebarMenuSkeleton', () => {
  it('renders successfully', () => {
    const { container } = render(<SidebarMenuSkeleton />);
    const skeleton = container.querySelector('[data-sidebar="menu-skeleton"]');
    expect(skeleton).toBeTruthy();
  });

  it('renders with icon when showIcon is true', () => {
    const { container } = render(<SidebarMenuSkeleton showIcon />);
    const icon = container.querySelector('[data-sidebar="menu-skeleton-icon"]');
    expect(icon).toBeTruthy();
  });
});
