import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { axe } from 'jest-axe';
import { NuverialHeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: NuverialHeaderComponent;
  let fixture: ComponentFixture<NuverialHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuverialHeaderComponent, SharedUtilsLoggingModule.useConsoleLoggingAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(NuverialHeaderComponent);
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
