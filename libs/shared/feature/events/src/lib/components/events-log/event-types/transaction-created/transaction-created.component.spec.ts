import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCreatedComponent } from './transaction-created.component';

describe('TransactionCreatedComponent', () => {
  let component: TransactionCreatedComponent;
  let fixture: ComponentFixture<TransactionCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCreatedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
