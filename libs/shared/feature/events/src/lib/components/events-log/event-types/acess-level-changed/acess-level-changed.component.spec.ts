import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditEventModel, AuditEventProfileUserAcessChangedMock } from '@dsg/shared/data-access/audit-api';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AcessLevelChangedComponent } from './acess-level-changed.component';

describe('AcessLevelChangedComponent', () => {
  let component: AcessLevelChangedComponent;
  let fixture: ComponentFixture<AcessLevelChangedComponent>;
  let auditEventAccessChangedModel: AuditEventModel;

  beforeEach(async () => {
    auditEventAccessChangedModel = new AuditEventModel(AuditEventProfileUserAcessChangedMock);

    await TestBed.configureTestingModule({
      imports: [AcessLevelChangedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcessLevelChangedComponent);
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
    component.event = auditEventAccessChangedModel;
    component.ngOnInit();

    expect(component.message).toBe("from 'Write' to 'Read-Only'");
  });

  it('should have content as empty when event is undefined', () => {
    component.ngOnInit();

    expect(component.message).toBe('');
  });
});
