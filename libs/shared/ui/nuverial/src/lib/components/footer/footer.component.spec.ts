import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe } from 'jest-axe';
import { NuverialFooterComponent } from './footer.component';

describe('NuverialFooterComponent', () => {
  let component: NuverialFooterComponent;
  let fixture: ComponentFixture<NuverialFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuverialFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NuverialFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
