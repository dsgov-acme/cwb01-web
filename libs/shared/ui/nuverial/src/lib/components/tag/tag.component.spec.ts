import { MatTooltip } from '@angular/material/tooltip';
import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialTagComponent } from './tag.component';
import { ITag } from './tag.model';

const dependencies = MockBuilder(NuverialTagComponent).mock(MatTooltip).build();

describe('NuverialTagComponent', () => {
  it('should create with default styles', async () => {
    const label = 'Test Tag';
    const { fixture } = await render(NuverialTagComponent, {
      ...dependencies,
      componentInputs: {
        tag: { label },
      },
    });

    expect(fixture.componentInstance).toBeTruthy();
    expect(screen.getByText(label)).toBeTruthy();
  });

  it('should create with custom colors', async () => {
    const label = 'Test Tag';
    const { fixture } = await render(NuverialTagComponent, {
      ...dependencies,
      componentInputs: {
        tag: {
          backgroundColor: '#fff',
          label,
          textColor: '#fff',
        },
      },
    });

    expect(fixture.componentInstance).toBeTruthy();
    expect(screen.getByText(label)).toBeTruthy();
  });

  it('should create with theme colors', async () => {
    const label = 'Test Tag';
    const { fixture } = await render(NuverialTagComponent, {
      ...dependencies,
      componentInputs: {
        tag: {
          backgroundColor: '--theme-white',
          label,
          textColor: '--theme-black',
        },
      },
    });

    expect(fixture.componentInstance).toBeTruthy();
    expect(screen.getByText(label)).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const mockTag: ITag = {
        backgroundColor: '--theme-white',
        label: 'Test Tag',
        textColor: '--theme-black',
      };
      const { fixture } = await render(NuverialTagComponent, {
        ...dependencies,
        componentInputs: {
          tag: mockTag,
        },
      });
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });
});
