import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditEventModel, AuditEventNoteAddedMock } from '@dsg/shared/data-access/audit-api';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NoteBaseEventComponent } from './note-base-event.component';

describe('NoteBaseEventComponent', () => {
  let component: NoteBaseEventComponent;
  let fixture: ComponentFixture<NoteBaseEventComponent>;
  let auditNoteBaseEventModel: AuditEventModel;

  beforeEach(async () => {
    auditNoteBaseEventModel = new AuditEventModel(AuditEventNoteAddedMock);

    await TestBed.configureTestingModule({
      imports: [NoteBaseEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteBaseEventComponent);
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

  it('should map correct form label with state changes', () => {
    component.event = auditNoteBaseEventModel;
    component.ngOnInit();

    expect(component.content).toBe('This is my Note');
  });

  it('should have content as empty when event is undefined', () => {
    component.ngOnInit();

    expect(component.content).toBe('');
  });
});
