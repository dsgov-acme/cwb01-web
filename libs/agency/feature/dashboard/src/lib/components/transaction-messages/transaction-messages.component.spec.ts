import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MessagingService } from '@dsg/shared/feature/messaging';
import { NuverialBreadcrumbComponent, NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { HttpTestingModule } from '@dsg/shared/utils/http';
import { axe } from 'jest-axe';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { TransactionDetailService } from '../transaction-detail/transaction-detail.service';
import { TransactionMessagesComponent } from './transaction-messages.component';

describe('TransactionMessagesComponent', () => {
  let component: TransactionMessagesComponent;
  let fixture: ComponentFixture<TransactionMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpTestingModule, TransactionMessagesComponent, NuverialBreadcrumbComponent],
      providers: [
        MockProvider(HttpClient),
        MockProvider(MessagingService),
        MockProvider(NuverialSnackBarService),
        MockProvider(ActivatedRoute, {
          children: [
            {
              url: of(['new-message']),
            },
          ],
          snapshot: {
            children: [
              {
                url: [],
              },
            ],
          },
        } as any),
        MockProvider(Router, {
          events: of(new NavigationEnd(1, '', '')),
        }),
        MockProvider(TransactionDetailService, {
          transactionId: '123-456-789',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionMessagesComponent);
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
