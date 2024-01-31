import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditEventModel, AuditEventNoteUpdatedMock } from '@dsg/shared/data-access/audit-api';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NoteUpdatedComponent } from './note-updated.component';

describe('NoteUpdatedComponent', () => {
  let component: NoteUpdatedComponent;
  let fixture: ComponentFixture<NoteUpdatedComponent>;
  let auditEventNoteUpdatedModel: AuditEventModel;

  beforeEach(async () => {
    auditEventNoteUpdatedModel = new AuditEventModel(AuditEventNoteUpdatedMock);

    await TestBed.configureTestingModule({
      imports: [NoteUpdatedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteUpdatedComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);
      expect.extend(toHaveNoViolations);
      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should show correct contents', () => {
    component.event = auditEventNoteUpdatedModel;
    component.ngOnInit();

    expect(component.title).toBe('Some Title');
    expect(component.body).toBe('Hello DSG');
  });

  it('should have content as empty when event is undefined', () => {
    component.ngOnInit();

    expect(component.title).toBe('');
    expect(component.body).toBe('');
  });
});
