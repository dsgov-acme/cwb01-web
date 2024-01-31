import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { MockBuilder, MockService, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import { first, skip, take } from 'rxjs/operators';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';
import { NuverialSelectComponent } from './select.component';
import { INuverialSelectDropDownOption, INuverialSelectOption } from './select.models';

const NUVERIAL_SELECT_OPTIONS_DROPDOWN: INuverialSelectOption[] = [
  {
    disabled: false,
    displayTextValue: 'Alabama',
    key: 'AL',
    selected: false,
  },
  {
    disabled: true,
    displayTextValue: 'Alaska',
    key: 'AK',
    selected: false,
  },
  {
    disabled: false,
    displayChipValue: 'AS',
    displayTextValue: 'American Samoa',
    key: 'AS',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Arizona',
    key: 'AZ',
    selected: false,
  },
  {
    disabled: false,
    displayChipValue: 'CA',
    displayTextValue: 'California',
    key: 'CA',
    selected: false,
  },
];

const dependencies = MockBuilder(NuverialSelectComponent)
  .keep(NuverialButtonComponent)
  .keep(NuverialIconComponent)
  .keep(CommonModule)
  .keep(ReactiveFormsModule)
  .keep(FormsModule)
  .keep(MatFormFieldModule)
  .keep(MatInputModule)
  .keep(MatAutocomplete)
  .keep(MatAutocompleteModule)
  .keep(MatAutocompleteTrigger)
  .mock(
    FocusMonitor,
    MockService(FocusMonitor, {
      monitor: () => of(null),
    }),
  )
  .build();

const SELECT_OPTIONS_DROPDOWN = NUVERIAL_SELECT_OPTIONS_DROPDOWN;

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialSelectComponent, {
    ...dependencies,
    ...props,
  });

  return { component: fixture.componentInstance, fixture };
};

describe('NuverialSelectComponent', () => {
  describe('Accessibility', () => {
    it('should have violations when ariaLabel is not set', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).not.toHaveNoViolations();
    });

    it('should have no violations when ariaLabel is set', async () => {
      const componentProperties = { ariaLabel: 'select-aria-label' };
      const { fixture } = await getFixture({ componentProperties });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
      expect(ngMocks.find(fixture, 'input').nativeElement.getAttribute('aria-label')).toEqual(componentProperties.ariaLabel);
    });

    it('should have no violations when label is set', async () => {
      const componentProperties = {
        label: 'select-label',
      };
      const { fixture } = await getFixture({ componentProperties });
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
      expect(ngMocks.find(fixture, 'input').nativeElement.getAttribute('aria-label')).toEqual(componentProperties.label);
    });
  });

  describe('Component Inputs', () => {
    it('should have default values', async () => {
      const { fixture } = await getFixture({});

      expect(fixture.componentInstance.ariaLabel).toBeFalsy();
      expect(fixture.componentInstance.ariaDescribedBy).toBeFalsy();
      expect(fixture.componentInstance.dropDownArialLabels).toBeFalsy();
      expect(fixture.componentInstance.displayError).toEqual(true);
      expect(fixture.componentInstance.floatLabel).toEqual('always');
      expect(fixture.componentInstance.label).toBeFalsy();
      expect(fixture.componentInstance.prefixIcon).toBeFalsy();
      expect(fixture.componentInstance.required).toEqual(false);
      expect(fixture.componentInstance.selectedOptionIconName).toBeFalsy();
      expect(fixture.componentInstance.selectOptions).toEqual([]);
      expect(fixture.componentInstance.prefixIcon).toBeFalsy();
      expect(fixture.componentInstance.validationMessages).toBeFalsy();

      const formField = ngMocks.find(fixture, 'mat-form-field');
      expect(formField).toBeTruthy();
      expect(formField.nativeElement.getAttribute('appearance')).toEqual('outline');
      expect(formField.nativeElement.getAttribute('ng-reflect-float-label')).toEqual('always');
    });

    it('should set ariaDescribedBy', async () => {
      const componentProperties = { ariaDescribedBy: 'aria-described-by' };
      const { fixture } = await getFixture({ componentProperties });
      expect(fixture.componentInstance.ariaDescribedBy).toEqual(componentProperties.ariaDescribedBy);
    });

    it('should default dropDownArialLabels', fakeAsync(async () => {
      const componentProperties = {
        formControl: new FormControl(),
      };
      const { fixture } = await getFixture({ componentProperties });
      fixture.componentInstance.suffixIconName$.subscribe((option: INuverialSelectDropDownOption) => {
        expect(option.ariaLabel).toEqual('Open menu');
        expect(option.iconName).toEqual('expand_more');
      });
      tick(500);
      fixture.detectChanges();
    }));

    it('should set displayError', async () => {
      const componentProperties = { displayError: false };
      const { fixture } = await getFixture({ componentProperties });
      expect(fixture.componentInstance.displayError).toEqual(componentProperties.displayError);
    });

    it('should set floatLabel', async () => {
      const componentProperties = { floatLabel: 'auto' };
      const { fixture } = await getFixture({ componentProperties });
      expect(fixture.componentInstance.floatLabel).toEqual(componentProperties.floatLabel);
    });

    it('should set label', async () => {
      const componentProperties = { label: 'test-form-label' };
      const { fixture } = await getFixture({ componentProperties });
      expect(fixture.componentInstance.label).toEqual(componentProperties.label);
      expect(screen.getByText(componentProperties.label)).toBeInTheDocument();
    });

    it('should prefixIcon default', async () => {
      await getFixture({});
      expect(() => ngMocks.find('.nuverial-icon')).toBeTruthy();
    });

    it('should set prefixIcon', async () => {
      const componentProperties = { prefixIcon: 'test-prefix-icon' };
      const { fixture } = await getFixture({ componentProperties });
      expect(fixture.componentInstance.prefixIcon).toEqual(componentProperties.prefixIcon);

      const icon = ngMocks.find('.nuverial-icon');
      expect(icon.nativeElement.getAttribute('ng-reflect-icon-name')).toEqual(componentProperties.prefixIcon);
    });

    it('should default required', async () => {
      const componentProperties = { label: 'test-form-label' };
      await getFixture({ componentProperties });
      expect(screen.getByText(componentProperties.label)).toBeInTheDocument();
      expect(() => ngMocks.find('.mat-mdc-form-field-required-marker')).toThrow();
    });

    it('should set required', async () => {
      const componentProperties = { label: 'test-form-label', required: true };
      const { fixture } = await getFixture({ componentProperties });
      expect(fixture.componentInstance.required).toEqual(componentProperties.required);
      expect(screen.getByText(componentProperties.label)).toBeInTheDocument();
      expect(ngMocks.find('.mat-mdc-form-field-required-marker')).toBeTruthy();
    });

    it('should set selectedOptionIconName', async () => {
      const componentProperties = { selectedOptionIconName: 'selected-option-icon-name' };
      const { fixture } = await getFixture({ componentProperties });
      expect(fixture.componentInstance.selectedOptionIconName).toEqual(componentProperties.selectedOptionIconName);
    });

    it('should set validationMessages', async () => {
      const componentProperties = { validationMessages: { required: 'test-required' } };
      const { fixture } = await getFixture({ componentProperties });
      expect(fixture.componentInstance.validationMessages).toEqual(componentProperties.validationMessages);
    });
  });

  describe('SelectDropDownMenu', () => {
    it('should display, open and close drop down menu options', fakeAsync(async () => {
      const closeOptions = { ariaLabel: 'Close menu', iconName: 'expand_less' };
      const openOptions = { ariaLabel: 'Open menu', iconName: 'expand_more' };
      const selectOptions = SELECT_OPTIONS_DROPDOWN.map(a => ({ ...a }));
      selectOptions[Math.round(selectOptions.length / 2)].selected = true;
      const componentProperties = {
        dropDownArialLabels: {
          open: 'Open menu',
        },
        formControl: new FormControl(),
        selectOptions,
        selectedOptionIconName: 'selected-option-icon-name',
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.componentInstance.selectOptions$.subscribe(result => {
        expect(result).toEqual(selectOptions);
      });
      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      const closePanelSpy = jest.spyOn(fixture.componentInstance['_matAutocompleteTrigger'], 'closePanel');
      const spy = jest.spyOn(fixture.componentInstance, 'onClickMenuIcon');
      const button = ngMocks.find(fixture, 'button');
      expect(button.nativeElement.getAttribute('aria-label')).toEqual(openOptions.ariaLabel);

      const icon = ngMocks.find('button .nuverial-icon');
      expect(icon).toBeTruthy();
      expect(icon.nativeElement.getAttribute('ng-reflect-icon-name')).toEqual(openOptions.iconName);

      ngMocks.click(button);
      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(button.nativeElement.getAttribute('aria-label')).toEqual(closeOptions.ariaLabel);
      expect(icon.nativeElement.getAttribute('ng-reflect-icon-name')).toEqual(closeOptions.iconName);

      selectOptions.forEach(option => {
        option.displayChipValue && expect(screen.getByText(option.displayChipValue)).toBeInTheDocument();
        expect(screen.getByText(option.displayTextValue)).toBeInTheDocument();
      });

      fixture.detectChanges();
      const optionIcon = ngMocks.find('nuverial-icon mat-icon');

      expect(optionIcon).toBeTruthy();
      expect(optionIcon.nativeElement.getAttribute('ng-reflect-font-icon')).toEqual(closeOptions.iconName);
      tick(250);

      ngMocks.click(button);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(closePanelSpy).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it('should select and set drop down menu option', fakeAsync(async () => {
      const formControl: FormControl = new FormControl();
      const componentProperties = {
        ariaLabel: 'select-aria-label',
        formControl,
        selectOptions: [
          {
            disabled: false,
            displayTextValue: 'Alabama',
            key: 'AL',
            selected: false,
          },
        ],
      };
      const { fixture } = await getFixture({ componentProperties });
      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      const button = ngMocks.find(fixture, 'button');
      ngMocks.click(button);

      tick(250);
      fixture.detectChanges();

      const option = ngMocks.find(MatOption);
      const spy = jest.spyOn(fixture.componentInstance, 'onOptionSelected');
      expect(option).toBeTruthy();
      ngMocks.click(option);

      expect(spy).toHaveBeenCalled();
      tick(250);
      fixture.detectChanges();

      expect(formControl.value).toEqual(componentProperties.selectOptions[0].key);
      fixture.componentInstance.validOptionSelected.pipe(first()).subscribe(selectedOption => {
        expect(selectedOption).toEqual(componentProperties.selectOptions[0]);
      });
      tick(250);
    }));

    it('should emit a valid option selected if the selected option has been changed, from the previous value', fakeAsync(async () => {
      const formControl: FormControl = new FormControl('T1');
      const componentProperties = {
        formControl,
        selectOptions: [
          {
            disabled: false,
            displayTextValue: 'Test 1',
            key: 'T1',
            selected: false,
          },
          {
            disabled: false,
            displayTextValue: 'Test 2',
            key: 'T2',
            selected: false,
          },
        ],
      };
      const { component, fixture } = await getFixture({ componentProperties });
      const spy = jest.spyOn(component.validOptionSelected, 'emit');

      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();

      formControl.setValue('T2');

      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();

      expect(component.formControl.value).toEqual('T2');
      expect(spy).toHaveBeenCalledWith({
        disabled: false,
        displayTextValue: 'Test 2',
        key: 'T2',
        selected: true,
      });
    }));

    it('should not emit a valid option selected if the selected option has not been changed, from the previous value', fakeAsync(async () => {
      const formControl: FormControl = new FormControl('T1');
      const componentProperties = {
        formControl,
        selectOptions: [
          {
            disabled: false,
            displayTextValue: 'Test 1',
            key: 'T1',
            selected: false,
          },
          {
            disabled: false,
            displayTextValue: 'Test 2',
            key: 'T2',
            selected: false,
          },
        ],
      };
      const { component, fixture } = await getFixture({ componentProperties });
      const spy = jest.spyOn(component.validOptionSelected, 'emit');

      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();

      formControl.setValue('T1');

      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();

      expect(component.formControl.value).toEqual('T1');
      expect(spy).not.toHaveBeenCalled();
    }));

    /**
     * Skipped because cannot get the form control value to update the search
     */
    it.skip('should select and set drop down menu option from form input', fakeAsync(async () => {
      const formControl: FormControl = new FormControl('cali');
      const componentProperties = {
        ariaLabel: 'select-aria-label',
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.componentInstance.selectOptions$.pipe(take(1)).subscribe(search => {
        expect(search).toBeTruthy();
        search &&
          expect(search).toEqual({
            disabled: false,
            displayChipValue: 'CA',
            displayTextValue: 'California',
            key: 'CA',
            selected: true,
          });
      });
    }));

    it('should invalidate drop down menu form controls', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: null }, [Validators.required]);
      const componentProperties = {
        ariaLabel: 'select-aria-label',
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
        validationMessages: { required: 'test-required' },
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.componentInstance.error$.pipe(take(1)).subscribe(error => {
        expect(error).toEqual(componentProperties.validationMessages.required);
        expect(formControl.status).toEqual('INVALID');
      });

      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      const input = ngMocks.find('input');
      ngMocks.trigger(input, 'click');

      tick(250);
      fixture.detectChanges();

      expect(formControl.value).toBeFalsy();
      ngMocks.trigger(input, 'blur');
    }));
  });

  describe('SearchDropDownMenu', () => {
    it('should display search options', fakeAsync(async () => {
      const openOptions = { ariaLabel: 'Open menu', iconName: 'expand_more' };
      const componentProperties = {
        formControl: new FormControl(),
        selectOptions: SELECT_OPTIONS_DROPDOWN,
        selectedOptionIconName: 'selected-option-icon-name',
      };
      const { fixture } = await getFixture({ componentProperties });
      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      const spy = jest.spyOn(fixture.componentInstance, 'onClickMenuIcon');
      const button = ngMocks.find(fixture, 'button');
      expect(button.nativeElement.getAttribute('aria-label')).toEqual(openOptions.ariaLabel);

      const icon = ngMocks.find('button .nuverial-icon');
      expect(icon).toBeTruthy();

      ngMocks.click(button);

      tick(250);

      expect(spy).toHaveBeenCalled();

      tick(250);
    }));

    it('should display all search results', fakeAsync(async () => {
      const formControl: FormControl = new FormControl();
      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.componentInstance.selectOptions$.pipe(take(1)).subscribe(search => {
        expect(search).toEqual(SELECT_OPTIONS_DROPDOWN);
      });
      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      const input = ngMocks.find('input');
      ngMocks.trigger(input, 'click');

      tick(250);
      fixture.detectChanges();

      SELECT_OPTIONS_DROPDOWN.forEach(option => {
        option.displayChipValue && expect(screen.getByText(option.displayChipValue)).toBeInTheDocument();
        expect(screen.getByText(option.displayTextValue)).toBeInTheDocument();
      });
      expect(formControl.value).toBeFalsy();
    }));

    /**
     * Skipped because search value doesn't update when the form control value * changes
     */
    it.skip('should display filtered search results', fakeAsync(async () => {
      const formControl: FormControl = new FormControl();
      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.componentInstance.selectOptions$.pipe(take(1)).subscribe(search => expect(search).toEqual(SELECT_OPTIONS_DROPDOWN));
      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      const input = ngMocks.find('input');
      ngMocks.trigger(input, 'click');
      ngMocks.change(input, 'cali');
      fixture.componentInstance.formControl.setValue('cali');
      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      fixture.componentInstance.selectOptions$.pipe(take(1)).subscribe(search => {
        expect(search).toEqual([
          {
            disabled: false,
            displayChipValue: 'CA',
            displayTextValue: 'California',
            key: 'CA',
            selected: true,
          },
        ]);
      });

      expect(screen.getByText('California')).toBeInTheDocument();

      const option = ngMocks.find(MatOption);
      const spy = jest.spyOn(fixture.componentInstance, 'onOptionSelected');
      expect(option).toBeTruthy();
      ngMocks.click(option);

      expect(spy).toHaveBeenCalled();
      tick(250);
      fixture.detectChanges();

      expect(formControl.value).toEqual('CA');
    }));

    it('should display filtered search results on form input string', fakeAsync(async () => {
      const formControl: FormControl = new FormControl('cali');
      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      fixture.componentInstance.selectOptions$.subscribe(search =>
        expect(search).toEqual([
          {
            disabled: false,
            displayChipValue: 'CA',
            displayTextValue: 'California',
            key: 'CA',
            selected: false,
          },
        ]),
      );
      fixture.detectChanges();
      tick(250);
    }));

    /**
     * Skipped because search value doesn't update when the form control value * changes
     */
    it.skip('should clear filtered search results', fakeAsync(async () => {
      const formControl: FormControl = new FormControl('California');
      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.componentInstance.selectOptions$.pipe(take(1)).subscribe(search =>
        expect(search).toEqual([
          {
            disabled: false,
            displayChipValue: 'CA',
            displayTextValue: 'California',
            key: 'CA',
            selected: true,
          },
        ]),
      );

      fixture.componentInstance.selectOptions$.pipe(skip(2), take(1)).subscribe(search => {
        expect(search).toBeTruthy();
        search &&
          expect(search[search.length - 1]).toEqual({
            disabled: false,
            displayChipValue: 'CA',
            displayTextValue: 'California',
            key: 'CA',
            selected: false,
          });
      });

      fixture.detectChanges();
      tick(250);

      const button = ngMocks.find(fixture, 'button');

      const icon = ngMocks.find('button .nuverial-icon');
      expect(icon).toBeTruthy();

      ngMocks.click(button);

      tick(250);
      fixture.detectChanges();
    }));

    it('should invalidate search form controls', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: null }, [Validators.required]);
      const componentProperties = {
        ariaLabel: 'select-aria-label',
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
        validationMessages: { required: 'test-required' },
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.componentInstance.error$.pipe(take(1)).subscribe(error => {
        expect(error).toEqual(componentProperties.validationMessages.required);
        expect(formControl.status).toEqual('INVALID');
      });

      fixture.detectChanges();
      tick(250);
      fixture.detectChanges();

      const input = ngMocks.find('input');
      ngMocks.trigger(input, 'click');

      tick(250);
      fixture.detectChanges();

      expect(formControl.value).toBeFalsy();
      ngMocks.trigger(input, 'blur');
    }));

    it('should invalidate search form controls after select/reset', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: 'cali' }, [Validators.required]);
      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
        validationMessages: { required: 'test-required' },
      };
      const { fixture } = await getFixture({ componentProperties });

      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();

      const input = ngMocks.find('input');
      ngMocks.trigger(input, 'click');

      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();

      const option = ngMocks.find(MatOption);
      expect(option).toBeTruthy();
      ngMocks.click(option);

      tick(500);
      fixture.detectChanges();

      expect(fixture.componentInstance.selectOptions.find(o => o.key === formControl.value)).toBeTruthy();

      fixture.componentInstance.error$.pipe(skip(1), take(1)).subscribe(error => {
        expect(error).toEqual(componentProperties.validationMessages.required);
        expect(formControl.status).toEqual('INVALID');
      });

      const button = ngMocks.find('button');
      ngMocks.trigger(button, 'click');

      tick(500);
      fixture.detectChanges();

      ngMocks.trigger(input, 'blur');
      tick(500);
      fixture.detectChanges();

      expect(formControl.value).toEqual(null);
    }));

    it('should remove/replace previous matchoptions validator with the new matchoptions when selectoptions are updated', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: 'cali' });
      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };

      const { fixture } = await getFixture({ componentProperties });

      const addValidatorsSpy = jest.spyOn(fixture.componentInstance.formControl, 'addValidators');
      const removeValidatorsSpy = jest.spyOn(fixture.componentInstance.formControl, 'removeValidators');

      fixture.detectChanges();
      tick(500);

      const newSelectOptions: INuverialSelectOption[] = [
        {
          disabled: false,
          displayTextValue: 'Alabama',
          key: 'AL',
          selected: false,
        },
      ];

      fixture.componentInstance.selectOptions = newSelectOptions;

      fixture.detectChanges();

      expect(addValidatorsSpy).toHaveBeenCalled();
      expect(removeValidatorsSpy).toHaveBeenCalled();
    }));

    it('should call applyAutoSelect when input element on blur', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: 'cali' });

      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };

      const { fixture } = await getFixture({ componentProperties });
      const spy = jest.spyOn(fixture.componentInstance, 'applyAutoSelect');
      fixture.componentInstance.selectOnBlur();

      fixture.detectChanges();
      tick(500);

      expect(spy).toHaveBeenCalled();
    }));

    it('should select an option on autocomplete closed if a matching option is found', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: 'cali' });

      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };

      const { fixture } = await getFixture({ componentProperties });
      fixture.componentInstance.formControl.setValue('california');
      fixture.componentInstance.applyAutoSelect();

      fixture.detectChanges();
      tick(500);

      expect(fixture.componentInstance.formControl.value).toBe('CA');
      expect(fixture.componentInstance.selectedOption).toBe(SELECT_OPTIONS_DROPDOWN.find(o => o.key === 'CA'));
    }));

    it('should not select any option on autocomplete closed if a matching option is not found', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: 'cali' });

      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };

      const { fixture } = await getFixture({ componentProperties });
      fixture.componentInstance.formControl.setValue('stateNotFound123');
      fixture.componentInstance.applyAutoSelect();

      fixture.detectChanges();
      tick(500);

      expect(fixture.componentInstance.selectedOption).toBe(undefined);
    }));

    it('should set formControl value to the correct state if the user enters the key of a valid option', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: 'cali' });

      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };

      const { fixture } = await getFixture({ componentProperties });

      fixture.componentInstance['_inputElementRef'].nativeElement.value = 'CA';
      fixture.componentInstance.formControl.setValue('CA');

      fixture.componentInstance.applyAutoSelect();

      fixture.detectChanges();
      tick(500);

      expect(fixture.componentInstance.selectedOption).toBe(SELECT_OPTIONS_DROPDOWN.find(o => o.key === 'CA'));
    }));

    it('should not set again the formControl value on closed if the selectedOption is selected and the form is valid', fakeAsync(async () => {
      const formControl: FormControl = new FormControl({ disabled: false, value: 'cali' });

      const componentProperties = {
        formControl,
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };

      const { fixture } = await getFixture({ componentProperties });

      const spy = jest.spyOn(fixture.componentInstance.formControl, 'setValue');

      fixture.componentInstance['_inputElementRef'].nativeElement.value = 'California';
      fixture.componentInstance.formControl.setValue('AK');
      fixture.componentInstance.selectedOption = SELECT_OPTIONS_DROPDOWN.find(o => o.key === 'CA');
      fixture.componentInstance.applyAutoSelect();

      fixture.detectChanges();
      tick(500);

      expect(spy).not.toHaveBeenCalledWith('CA');
      expect(fixture.componentInstance.selectedOption).toBe(SELECT_OPTIONS_DROPDOWN.find(o => o.key === 'CA'));
    }));
  });

  describe('SelectMenu Aria', () => {
    let renderedFixture: ComponentFixture<NuverialSelectComponent>;
    beforeEach(fakeAsync(async () => {
      const componentProperties = {
        ariaLabel: 'select-aria-label',
        formControl: new FormControl(),
        selectOptions: SELECT_OPTIONS_DROPDOWN,
      };
      const { fixture } = await getFixture({ componentProperties });
      fixture.detectChanges();
      tick(250);

      const button = ngMocks.find(fixture, 'button');
      ngMocks.click(button);
      fixture.detectChanges();
      tick(250);

      fixture.componentInstance.selectOptions$.subscribe(result => {
        expect(result).toEqual(SELECT_OPTIONS_DROPDOWN);
      });

      renderedFixture = fixture;
      tick(250);
    }));

    it('should display select options without search', async () => {
      const axeResults = await axe(renderedFixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });
});
