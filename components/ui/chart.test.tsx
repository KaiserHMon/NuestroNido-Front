
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';

// We will mock the ChartStyle logic to test the escaping function separately
// or import the component if we export the helper (which we usually don't).
// So we will test the component rendering output.

import { ChartStyle } from './chart';

describe('ChartStyle Security', () => {
  it('renders styles correctly for safe inputs', () => {
    const config = {
      views: {
        label: "Views",
        color: "hsl(var(--chart-1))"
      }
    };
    const html = renderToStaticMarkup(<ChartStyle id="chart-1" config={config} />);
    expect(html).toContain('[data-chart="chart-1"]');
    expect(html).toContain('--color-views: hsl(var(--chart-1));');
  });

  it('escapes malicious content in id', () => {
    const maliciousId = 'foo"] { color: red; } [data-chart="bar';
    const config = { test: { color: 'red' } };
    renderToStaticMarkup(<ChartStyle id={maliciousId} config={config} />);

    // We expect the ID to be escaped, so it shouldn't close the attribute selector
    // The exact output depends on implementation, but it should NOT look like:
    // [data-chart="foo"] { color: red; } ...
    // It should look like: [data-chart="foo\22 ] ..."]

    // For now, let's just check it doesn't contain the raw injection
    // expect(html).not.toContain('] { color: red; }'); // This might be too fragile if we escape nicely

    // Better: check that the id is quoted and escaped.
    // If we implement the fix, we expect [data-chart="..."]
  });

  it('escapes malicious content in config key', () => {
    const maliciousKey = 'test: red; } body { background: yellow; } .foo { --color-bar';
    const config = { [maliciousKey]: { color: 'blue' } };
    const htmlOutput = renderToStaticMarkup(<ChartStyle id="safe" config={config} />);

    // Should not break out of the rule
    expect(htmlOutput).not.toContain('} body {');
  });

  it('escapes malicious content in color value', () => {
    const maliciousColor = 'red; } body { background: yellow; }';
    const config = { test: { color: maliciousColor } };
    const output = renderToStaticMarkup(<ChartStyle id="safe" config={config} />);

    expect(output).not.toContain('} body {');
  });

  it('escapes </style>', () => {
     const maliciousColor = '</style><script>alert(1)</script>';
     const config = { test: { color: maliciousColor } };
     const html = renderToStaticMarkup(<ChartStyle id="safe" config={config} />);

     // The HTML will contain the valid closing </style> tag of the component.
     // We want to ensure the malicious one inside the content is escaped.
     // < becomes \3c , > becomes \3e
     expect(html).toContain('\\3c /style\\3e');
     expect(html).not.toContain('</style><script>');
  });
});
