import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuverialPillComponent } from './pill.component';

describe('StatusPillComponent', () => {
  let component: NuverialPillComponent;
  let fixture: ComponentFixture<NuverialPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuverialPillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NuverialPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
