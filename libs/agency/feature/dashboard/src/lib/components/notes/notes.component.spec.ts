import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteModel, NoteTypesMock, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { LoggingAdapter } from '@dsg/shared/utils/logging';
import { axe } from 'jest-axe';
import { MockProvider, ngMocks } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';

import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { EnumerationsStateService } from '@dsg/shared/feature/app-state';
import { ConfirmationModalReponses, NuverialSnackBarService } from '@dsg/shared/ui/nuverial';
import { PagingResponseModel, SortOrderButton } from '@dsg/shared/utils/http';
import { TransactionDetailService } from '../transaction-detail/transaction-detail.service';
import { NotesComponent } from './notes.component';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let router: Router;

  const mockNotes = [
    new NoteModel({
      body: 'Note body 1',
      createdBy: 'user1',
      createdTimestamp: '2023-07-01T00:00:00Z',
      id: 'note1',
      lastUpdatedBy: 'user2',
      lastUpdatedTimestamp: '2023-07-02T00:00:00Z',
      title: 'Note 1',
      type: {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'General Note',
      },
    }),
    new NoteModel({
      body: 'Note body 2',
      createdBy: 'user3',
      createdTimestamp: '2023-07-03T00:00:00Z',
      id: 'note2',
      lastUpdatedBy: 'user4',
      lastUpdatedTimestamp: '2023-07-04T00:00:00Z',
      title: 'Note 2',
      type: {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
        name: 'Email',
      },
    }),
  ];

  const mockDialog = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of(ConfirmationModalReponses.PrimaryAction),
    }),
  };

  const mockDialogConfig = new MatDialogConfig();

  const mockLoggingService = {
    error: jest.fn(),
    log: jest.fn(),
  };

  let notes: ReplaySubject<NoteModel[]>;
  let pagingMetadata: PagingResponseModel;

  beforeEach(async () => {
    notes = new ReplaySubject<NoteModel[]>(1);
    pagingMetadata = new PagingResponseModel({ nextPage: '1', pageNumber: 0, pageSize: 10, totalCount: 15 });

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NoopAnimationsModule, NotesComponent, MatDialogModule],
      providers: [
        MockProvider(WorkApiRoutesService),
        MockProvider(MatDialog, mockDialog),
        MockProvider(NuverialSnackBarService),
        MockProvider(TransactionDetailService, {
          clearNotes: jest.fn(),
          deleteNote$: jest.fn().mockReturnValue(of([])),
          loadNotes$: jest.fn().mockReturnValue(of([])),
          notes$: notes.asObservable(),
          notesPagination: pagingMetadata,
          transactionId: 'mockTransactionId',
        }),
        MockProvider(EnumerationsStateService, {
          getEnumMap$: jest.fn().mockReturnValue(of(NoteTypesMock)),
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'transactionId' }),
            snapshot: {
              paramMap: {
                get: () => 'mockValue',
              },
              params: { transactionId: 'mockValue' },
            },
          },
        },
        {
          provide: LoggingAdapter,
          useValue: mockLoggingService,
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatDialogConfig, useValue: mockDialogConfig },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no violations', async () => {
    const axeResults = await axe(fixture.nativeElement);
    expect(axeResults).toHaveNoViolations();
  });

  it('should render a header with an "Add New Note" button by default', () => {
    const addNewNoteButton = fixture.debugElement.query(By.css('nuverial-button[ariaLabel="Add New Note"]'));
    expect(addNewNoteButton).not.toBeNull();
    expect(addNewNoteButton.nativeElement.textContent).toContain('Add New Note');
  });

  it('should render a toolbar with "Sort" and "Filter" buttons for past notes', () => {
    const sortButton = fixture.debugElement.query(By.css('nuverial-selector-button-dropdown[ariaLabel="Sort By"]'));
    expect(sortButton).not.toBeNull();
    expect(sortButton.nativeElement.textContent).toContain('Created Date');
  });

  it('should render a call to action to add new notes if no past notes exist', () => {
    notes.next([]);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const ctaContainer = fixture.debugElement.query(By.css('.notes-cta'));
      expect(ctaContainer).not.toBeNull();

      const ctaMessage = fixture.debugElement.query(By.css('.notes-cta-message'));
      expect(ctaMessage.nativeElement.textContent).toContain("No notes have been added. Start a new note by clicking the 'Add New Note' button above!");
    });
  });

  it('should navigate to add-note when navigateToAddNote method is called', () => {
    const transactionDetailService = TestBed.inject(TransactionDetailService);

    const mockTransactionId = 'mockTransactionId';
    (transactionDetailService as any).transactionId = 'mockTransactionId';
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToAddNote();
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard', 'transaction', mockTransactionId, 'notes', 'add-note']);
  });

  it('should not navigate if transactionId is falsy', () => {
    const transactionDetailService = TestBed.inject(TransactionDetailService);

    (transactionDetailService as any).transactionId = '';
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToAddNote();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should transform notes$', done => {
    notes.next(mockNotes);
    component.notes$?.subscribe(_notes => {
      expect(_notes.length).toEqual(2);
      expect(_notes[0]).toBeInstanceOf(NoteModel);
      expect(_notes[0].id).toEqual('note1');
      expect(_notes[0].body).toEqual('Note body 1');
      expect(_notes[0].type).toEqual({ id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'General Note' });
      expect(_notes[1]).toBeInstanceOf(NoteModel);
      expect(_notes[1].id).toEqual('note2');
      expect(_notes[1].body).toEqual('Note body 2');
      expect(_notes[1].type).toEqual({ id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480', name: 'Email' });
      done();
    });
  });

  it('should set isLoadingMoreNotes to true when getting more notes', () => {
    const getNotesSpy = jest.spyOn(component, 'getNotes$');
    component.loadMoreNotes();
    expect(getNotesSpy).toHaveBeenCalledTimes(1);
  });

  it('should not load more notes if nextPage is an empty string', () => {
    const transactionDetailService = TestBed.inject(TransactionDetailService);

    (transactionDetailService as any).notesPagination = { nextPage: '' }; // changed from notesPagination$
    const getNotesSpy = jest.spyOn(component, 'getNotes$');
    component.loadMoreNotes();
    expect(getNotesSpy).not.toHaveBeenCalled();
  });

  it('should load more notes if nextPage is provided and increment pageNumber', () => {
    const transactionDetailService = TestBed.inject(TransactionDetailService);

    (transactionDetailService as any).notesPagination = { nextPage: 'someValue' }; // changed from notesPagination$
    component['_pagingRequestModel'].pageNumber = 1;
    const getNotesSpy = jest.spyOn(component, 'getNotes$');
    component.loadMoreNotes();
    expect(getNotesSpy).toHaveBeenCalled();
    expect(component['_pagingRequestModel'].pageNumber).toBe(2);
  });

  it('should call getNotes on ngOnInit', () => {
    const spy = jest.spyOn(component, 'getNotes$');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should get note types enum map ngOnInit', () => {
    const enumsSpy = jest.spyOn(TestBed.inject(EnumerationsStateService), 'getEnumMap$');
    component.ngOnInit();

    expect(enumsSpy).toHaveBeenCalled();
    expect(component.noteTypesLabels['Email']).toEqual('Email');
  });

  it('should call clearNotes on ngOnDestroy', () => {
    component.ngOnDestroy();

    const transactionDetailService = TestBed.inject(TransactionDetailService);
    const spy = jest.spyOn(transactionDetailService, 'clearNotes');
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate when edit note is called', () => {
    const transactionService = ngMocks.findInstance(TransactionDetailService);
    const routerService = ngMocks.findInstance(Router);
    const navigateSpy = jest.spyOn(routerService, 'navigate');

    const noteId = '123';

    component.editNote(noteId);

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard', 'transaction', transactionService.transactionId, 'notes', noteId]);
  });

  it('should return index for trackByFn', () => {
    const index = 5;
    const result = component.trackByFn(index);
    expect(result).toEqual(index);
  });

  describe('Delete Note', () => {
    it('should delete note if user confirms', () => {
      const noteId = '123';

      const dialogService = ngMocks.findInstance(MatDialog);
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockReturnValue({
        afterClosed: () => of(ConfirmationModalReponses.PrimaryAction),
      } as any);

      const transactionService = ngMocks.findInstance(TransactionDetailService);
      const deleteNoteSpy = jest.spyOn(transactionService, 'deleteNote$');

      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSpy = jest.spyOn(snackService, 'notifyApplicationSuccess');

      component.deleteNote(noteId);

      expect(dialogOpenSpy).toHaveBeenCalled();
      expect(deleteNoteSpy).toHaveBeenCalledWith(transactionService.transactionId, noteId);
      expect(successSpy).toHaveBeenCalled();
    });

    it('should not delete note if user confirms', () => {
      const noteId = '123';

      const dialogService = ngMocks.findInstance(MatDialog);
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockReturnValue({
        afterClosed: () => of(undefined),
      } as any);

      const transactionService = ngMocks.findInstance(TransactionDetailService);
      const deleteNoteSpy = jest.spyOn(transactionService, 'deleteNote$');

      const snackService = ngMocks.findInstance(NuverialSnackBarService);
      const successSpy = jest.spyOn(snackService, 'notifyApplicationSuccess');

      component.deleteNote(noteId);

      expect(dialogOpenSpy).toHaveBeenCalled();
      expect(deleteNoteSpy).not.toHaveBeenCalled();
      expect(successSpy).not.toHaveBeenCalled();
    });
  });

  describe('changeSortBy', () => {
    it('should update sort criteria and button text', () => {
      const selectItem = { disabled: false, displayTextValue: 'Created Date', key: 'createdDate', selected: false };
      component.changeSortBy(selectItem);
      expect(component['_pagingRequestModel'].sortBy).toEqual(selectItem.key);
      expect(component.sortByButtonText).toEqual(`Sort By: ${selectItem.displayTextValue}`);
    });

    it('should call _sortNotes indirectly', () => {
      const transactionDetailService = TestBed.inject(TransactionDetailService);

      const clearNotesSpy = jest.spyOn(transactionDetailService, 'clearNotes');
      const selectItem = { disabled: false, displayTextValue: 'Created Date', key: 'createdDate', selected: false };
      component.changeSortBy(selectItem);

      expect(component['_pagingRequestModel'].sortBy).toEqual(selectItem.key);
      expect(component['_pagingRequestModel'].pageNumber).toEqual(0);
      expect(clearNotesSpy).toHaveBeenCalled();
    });
  });

  describe('toggleOrder', () => {
    it('should toggle from descending to ascending', () => {
      component.orderButtonIcon = SortOrderButton.descending;
      component.toggleOrder();
      expect(component.orderButtonIcon).toEqual(SortOrderButton.ascending);
      expect(component['_pagingRequestModel'].sortOrder).toEqual('ASC');
    });

    it('should toggle from ascending to descending', () => {
      component.orderButtonIcon = SortOrderButton.ascending;
      component.toggleOrder();
      expect(component.orderButtonIcon).toEqual(SortOrderButton.descending);
      expect(component['_pagingRequestModel'].sortOrder).toEqual('DESC');
    });

    it('should call _sortNotes indirectly', () => {
      const transactionDetailService = TestBed.inject(TransactionDetailService);

      const clearNotesSpy = jest.spyOn(transactionDetailService, 'clearNotes');
      component.toggleOrder();
      expect(clearNotesSpy).toHaveBeenCalled();
    });
  });
});
