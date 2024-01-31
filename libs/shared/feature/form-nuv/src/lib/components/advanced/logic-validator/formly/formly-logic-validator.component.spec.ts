import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { FormRendererService } from '../../../../services';
import { FormlyLogicValidatorComponent } from './formly-logic-validator.component';

const mockDialog = {
  open: jest.fn().mockReturnValue({
    afterClosed: () => of(''),
  }),
};

class MockFormlyLogicValidatorComponent extends FormlyLogicValidatorComponent {}

describe('FormlyLogicValidatorComponent', () => {
  let component: MockFormlyLogicValidatorComponent;
  let fixture: ComponentFixture<MockFormlyLogicValidatorComponent>;
  let dialog: MatDialog;

  function setup() {
    fixture = TestBed.createComponent(MockFormlyLogicValidatorComponent);
    component = fixture.componentInstance;
    component.field.key = 'nuverialLogicValidator';
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  }

  describe('with errors', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        providers: [
          MockProvider(MatDialog, mockDialog),
          MockProvider(FormRendererService, {
            formErrors$: of([
              {
                controlName: 'nuverialLogicValidator',
                errorName: 'someError',
                id: 'someId',
                label: 'someLabel',
              },
            ]),
          }),
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      setup();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should open modal when form error occurs', () => {
      component.ngOnInit();
      expect(dialog.open).toHaveBeenCalled();
    });
  });

  describe('with no errors', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        providers: [
          MockProvider(MatDialog, mockDialog),
          MockProvider(FormRendererService, {
            formErrors$: of([]),
          }),
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      setup();
    });

    it('should not open modal when there are no errors', () => {
      jest.clearAllMocks();
      component.ngOnInit();
      expect(dialog.open).not.toHaveBeenCalled();
    });
  });
});
