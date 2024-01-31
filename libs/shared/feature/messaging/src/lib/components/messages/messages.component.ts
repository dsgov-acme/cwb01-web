import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationModel } from '@dsg/shared/data-access/work-api';
import {
  INFINITE_SCROLL_DEFAULTS,
  ITag,
  NuverialButtonComponent,
  NuverialIconComponent,
  NuverialSnackBarService,
  NuverialSpinnerComponent,
  NuverialTagComponent,
} from '@dsg/shared/ui/nuverial';
import { AccessControlModule } from '@dsg/shared/utils/access-control';
import { PagingRequestModel } from '@dsg/shared/utils/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, EMPTY, Observable, catchError, switchMap, tap } from 'rxjs';
import { MessagingService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AccessControlModule,
    CommonModule,
    InfiniteScrollModule,
    NuverialButtonComponent,
    NuverialSpinnerComponent,
    NuverialIconComponent,
    NuverialTagComponent,
  ],
  selector: 'dsg-messages',
  standalone: true,
  styleUrls: ['./messages.component.scss'],
  templateUrl: './messages.component.html',
})
export class MessagesComponent implements OnInit, OnDestroy {
  private readonly _pagingRequestModel: PagingRequestModel = new PagingRequestModel({
    pageSize: 15,
    sortBy: 'createdTimestamp',
    sortOrder: 'DESC',
  });
  public scrollDistance = INFINITE_SCROLL_DEFAULTS.scrollDistance;
  public scrollUpDistance = INFINITE_SCROLL_DEFAULTS.scrollUpDistance;
  public throttle = INFINITE_SCROLL_DEFAULTS.throttle;
  public isLoadingConversations = false;
  public hasMoreConversations = true;

  public disableScroll = false;
  private readonly _fetchConversations: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  public conversations$: Observable<ConversationModel[]> = this._fetchConversations.asObservable().pipe(
    tap(() => {
      this.isLoadingConversations = true;
      this._cdr.detectChanges();
    }),
    switchMap(() => this._messagingService.getConversations$([], this._pagingRequestModel)),
    tap(response => {
      this.isLoadingConversations = false;
      this._cdr.detectChanges();
      !response.pagingMetadata.nextPage && (this.disableScroll = true);
    }),
    switchMap(() => this._messagingService.conversations$),
    catchError(() => {
      this.isLoadingConversations = false;
      this._cdr.detectChanges();
      this._nuverialSnackBarService.notifyApplicationError();

      return EMPTY;
    }),
  );

  public newTag: ITag = {
    backgroundColor: '--theme-color-primary',
    label: 'New',
  };

  constructor(
    private readonly _messagingService: MessagingService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _nuverialSnackBarService: NuverialSnackBarService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this._fetchConversations.next();
  }

  public goToNewMessage() {
    this._router.navigate(['new-message'], { relativeTo: this._route });
  }

  public loadMoreConversations() {
    this._pagingRequestModel.pageNumber += 1;
    this._fetchConversations.next();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public ngOnDestroy(): void {
    this._messagingService.clearConversations();
  }
}
