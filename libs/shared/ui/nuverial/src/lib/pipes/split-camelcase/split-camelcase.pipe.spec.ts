import { TemplateRef } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { SplitCamelCasePipe } from './split-camelcase.pipe';

describe('SplitCamelCasePipe', () => {
  const pipe = new SplitCamelCasePipe();

  it('transforms "createdByTimestamp" to "Created By Timestamp"', () => {
    expect(pipe.transform('createdByTimestamp')).toBe('Created By Timestamp');
  });

  it('transforms "firstName" to "First Name"', () => {
    expect(pipe.transform('firstName')).toBe('First Name');
  });

  function renderPipe() {
    return render(`<div data-testid="property">{{'createdByTimestamp' | nuverialSplitCamelCase}}</div>`, {
      imports: [SplitCamelCasePipe],
      providers: [{ provide: TemplateRef, useValue: {} }],
    });
  }

  it('should check if pipe is working in DOM', async () => {
    const { fixture } = await renderPipe();

    fixture.detectChanges();

    expect(screen.getByTestId('property').textContent).toBe('Created By Timestamp');
  });
});
