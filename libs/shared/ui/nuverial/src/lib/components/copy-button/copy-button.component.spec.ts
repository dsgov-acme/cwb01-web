import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialIconComponent } from '../icon';
import { NuverialCopyButtonComponent } from './index';

const dependencies = MockBuilder(NuverialCopyButtonComponent).build();

describe('CopyButtonComponent', () => {
  let component: NuverialCopyButtonComponent;
  let fixture: ComponentFixture<NuverialCopyButtonComponent>;

  Object.assign(navigator, {
    clipboard: { writeText: jest.fn().mockImplementation(() => Promise.resolve()) },
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NuverialIconComponent, MatTooltipModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NuverialCopyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should display the tooltip when the copy function is called', async () => {
    const template = `<nuverial-copy-button copyText="Copy text" tooltipText=""></nuverial-copy-button>`;
    await render(template, { ...dependencies });
    component.copy();
    expect(document.querySelector('.mat-mdc-tooltip div')).toBeTruthy();
  });

  describe('copy to clipboard', () => {
    it('should write to the clipboard', async () => {
      const template = `<nuverial-copy-button copyText="Copy text"></nuverial-copy-button>`;
      await render(template, { ...dependencies });
      component.copy();
      expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
      jest.resetAllMocks();
    });

    it('should copy the provided text to the clipboard', async () => {
      const template = `<nuverial-copy-button copyText="Copy text"></nuverial-copy-button>`;
      await render(template, { ...dependencies });
      component.copy();
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(component.copyText);
      jest.resetAllMocks();
    });
  });
});
