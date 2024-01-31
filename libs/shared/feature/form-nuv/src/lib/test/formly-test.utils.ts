import { FormGroup, Validators } from '@angular/forms';
import { PublicPortalIntakeRendererOptions } from '../components';

export const MockTemplate = `<form [formGroup]="form">
<formly-form [model]="model" [fields]="fields" [options]="options" [form]="form"></formly-form>
</form>`;

const MockForm = new FormGroup({});

export const MockDefaultComponentProperties = {
  fields: [],
  form: MockForm,
  model: {},
  options: PublicPortalIntakeRendererOptions,
};

export const MockDefaultFormlyModuleConfiguration = {
  validators: [
    { name: 'email', validation: Validators.email },
    { name: 'required', validation: Validators.required },
  ],
};
