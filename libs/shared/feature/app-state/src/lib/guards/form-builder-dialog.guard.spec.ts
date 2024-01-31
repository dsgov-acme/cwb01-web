import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilderComponent } from '@formio/angular';
import { provideMock } from '@testing-library/angular/jest-utils';
import { CanDeactivateFormBuilderContract } from './form-builder-dialog.guard';

class MockComponent {
  public formioComponent: FormBuilderComponent | undefined = undefined;
}

describe('CanDeactivateFormBuilder', () => {
  let formBuilderGuard: CanDeactivateFormBuilderContract<MockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateFormBuilderContract, provideMock(Router)],
    });

    formBuilderGuard = TestBed.inject(CanDeactivateFormBuilderContract);
  });

  it('should create', () => {
    expect(formBuilderGuard).toBeTruthy();
  });

  it('should close dialog if dialog exists and return true', () => {
    const component = new MockComponent();
    component.formioComponent = {
      formio: {
        dialog: {
          close: () => undefined,
        },
      },
    } as FormBuilderComponent;

    const spy = jest.spyOn(component['formioComponent']['formio']['dialog'], 'close');

    const canDeactivate = formBuilderGuard.canDeactivate(component);

    expect(spy).toHaveBeenCalled();
    expect(canDeactivate).toBeTruthy();
  });

  it('should return true if no dialog', () => {
    const component = new MockComponent();
    const canDeactivate = formBuilderGuard.canDeactivate(component);
    expect(canDeactivate).toBeTruthy();
  });
});
