import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { INuverialSelectOption, NuverialSectionHeaderComponent, NuverialTextInputComponent } from '@dsg/shared/ui/nuverial';
import { FormlyExtension, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { defaultPrePopulateAdvancedComponent, FormlyBaseComponent, isPrePopulated } from '../../../base';
import { FormlyAddressFieldProperties } from './formly-address.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule, NuverialSectionHeaderComponent, NuverialTextInputComponent],
  selector: 'dsg-formly-address',
  standalone: true,
  styleUrls: ['./formly-address.component.scss'],
  templateUrl: './formly-address.component.html',
})
export class FormlyAddressComponent extends FormlyBaseComponent<FormlyAddressFieldProperties> implements FormlyExtension, OnInit {
  public countrySelectLabels = new Map();
  public reviewDetailsMap = new Map<string, string>();

  public prePopulate(field: FormlyFieldConfig<FormlyAddressFieldProperties>): void {
    if (isPrePopulated(field)) return;

    defaultPrePopulateAdvancedComponent(field);

    const labelField: FormlyFieldConfig = {
      className: 'flex-full',
      props: {
        label: field.props?.label,
      },
      type: 'nuverialSectionHeader',
    };

    const fieldGroup = [field.props?.label ? labelField : {}, ...(field.fieldGroup || [])].map(_field => {
      switch (true) {
        case _field.props?.['componentId'] === 'addressLine1':
          return {
            ..._field,
            className: 'flex-half',
            props: {
              ..._field.props,
              autocomplete: 'address-line1',
              type: 'text',
            },
            type: 'nuverialTextInput',
          };
        case _field.props?.['componentId'] === 'addressLine2':
          return {
            ..._field,
            className: 'flex-half',
            props: {
              ..._field.props,
              autocomplete: 'address-line2',
              type: 'text',
            },
            type: 'nuverialTextInput',
          };
        case _field.props?.['componentId'] === 'city':
          return {
            ..._field,
            className: 'flex-half',
            props: {
              ..._field.props,
              autocomplete: 'address-level2',
              type: 'text',
            },
            type: 'nuverialTextInput',
          };
        case _field.props?.['componentId'] === 'stateCode':
          return {
            ..._field,
            className: 'flex-half',
            props: {
              ..._field.props,
              autocomplete: 'address-level1',
            },
            type: 'nuverialSelect',
          };
        case _field.props?.['componentId'] === 'postalCode':
          return {
            ..._field,
            className: 'flex-quarter',
            props: {
              ..._field.props,
              autocomplete: 'postal-code',
              type: 'text',
            },
            type: 'nuverialTextInput',
          };
        case _field.props?.['componentId'] === 'postalCodeExtension':
          return {
            ..._field,
            className: 'flex-quarter',
            props: {
              ..._field.props,
              type: 'text',
            },
            type: 'nuverialTextInput',
          };
        case _field.props?.['componentId'] === 'countryCode':
          return {
            ..._field,
            className: 'flex-half',
            props: {
              ..._field.props,
              autocomplete: 'country',
            },
            type: 'nuverialSelect',
          };
        default:
          return _field;
      }
    });
    field.fieldGroup = fieldGroup;
  }

  public ngOnInit(): void {
    this.field.fieldGroup?.forEach(field => {
      this.reviewDetailsMap.set(field.props?.['componentId'], this.form.get(field?.key?.toString() || '')?.value);
    });
    this.field.fieldGroup
      ?.find(field => field.props?.['componentId'] === `countryCode`)
      ?.props?.['selectOptions']?.forEach((option: INuverialSelectOption) => this.countrySelectLabels.set(option.key, option.displayTextValue));
  }

  public trackByFn(_index: number, item: FormlyFieldConfig) {
    return item.id;
  }

  public get reviewDetails() {
    this.reviewDetailsMap.set('countryLabel', this.countrySelectLabels.get(this.reviewDetailsMap.get('countryCode')));
    const model = Object.fromEntries(this.reviewDetailsMap);

    return model;
  }
}
