import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fireEvent, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { NuverialFileProcessorTooltipComponent } from './file-processor-tooltip.component';
import { ITooltipProcessingResult } from './file-processor-tooltip.model';

const processorsMock = [
  {
    processorId: 'antivirus-scanner',
    result: {
      code: 'NOT READY',
      message: 'Document is not ready',
      status: 500,
    },
    status: 'COMPLETE',
    timestamp: '2023-08-02T16:03:26.925543Z',
  },
] as unknown as ITooltipProcessingResult[];

describe('FileProcessorTooltipComponent', () => {
  let component: NuverialFileProcessorTooltipComponent;
  let fixture: ComponentFixture<NuverialFileProcessorTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuverialFileProcessorTooltipComponent, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NuverialFileProcessorTooltipComponent);
    component = fixture.componentInstance;
    component.processors = processorsMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      component.isTooltipOpen = true;
      fixture.detectChanges();

      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should verify the dom', async () => {
    fireEvent.mouseEnter(screen.getByTestId('file-processor-tooltip-trigger'));
    fixture.detectChanges();

    expect(component.isTooltipOpen).toBe(true);
  });

  it('trackByFn', async () => {
    const results = component.trackByFn(1);

    expect(results).toEqual(1);
  });
});
