# Forms development

- Formly is a mature angular dynamic form rendering engine that we are using to render both an intake form and a form data review page from a single json configuration
- Formio provides a flexible form builder, we are using a customized version of this to build our form json configuration

## Helpful links

- [Angular Formio custom components documentation](https://github.com/formio/angular/wiki/Custom-Components-with-Angular-Elements#define-the-options)
- [Formio builder documentation](https://help.form.io/developers/form-builder#overriding-behavior)
- [Formio sandbox](https://formio.github.io/formio.js/app/sandbox.html)
- [Formio documentation for configuring the form builder json](https://formio.github.io/formio.js/app/examples/custombuilder.html) - lots of good json configuration examples are here
- [Formio builder documentation](https://help.form.io/userguide/form-building) - another resource for getting json examples
- [Formio sdk](https://formio.github.io/formio.js/app/sdk) - another resource for getting json examples
- [Formly custom components documentation](https://formly.dev/docs/guide/custom-formly-field)
- [Formly field properties and options](https://formly.dev/docs/guide/properties-options) - we are not yet using all of these, what we are using should be documented below
- [Formly expressions](https://formly.dev/docs/guide/expression-properties) - conditionals to hide or disable fields, usually dependant on another fields value
- [Formly validation](https://formly.dev/docs/guide/validation) - Formly, comes with a handful of validators; `max`, `min`, `minLength`, `maxLength`, `required`, the other validators such as `email`, etc. are custom validators provided by us.

## Development guidelines

To build a new form component we will need to build wrapper components to handle the integration between Formly and Formio.

### Important details

- Our form builder needs to be built so that it configures the json in the format that our Formly renderer expects
- There are a few cases that we cannot configure the Formio builder to match what Formly expects, we should keep these to a minimum, we have a FormConfigurationModel for converting Formio to Formly
  - Formio calls component arrays components and formly calls component arrays fieldGroup
  - We still need to figure out how to customize the Formio steps component, until then we convert the following
    - Formio `attributes` to Formly `expressions`
    - Formio `properties` to Formly `props`
    - Formio `title` to Formly `props.label`
- If need to expose any additional field options, this is don by:
  - Updating the option to the `fieldOptions` array in `formio-builder-base.model`
  - Adding an `@input` property to `formio-base.component`. if the property is specific only to a single component this can be done for that specific component, but this should be rare.
- Formly json attribute details:

  - `key` - the key that relates to the data model, ex. `firstName`
  - `type` - the field component name ex. `nuverialTextInput`
  - `className` - used to the form field width
  - `props` - display specific options and Formly provided validators, a list of the ones we are using so far is provided below
  - `validators` - for custom validation, `email`, `phone`, etc.
  - `validation` - to override validation messages

  List of display props that we are using:

  ```typescript
  {
    ariaLabel?: string;
    ariaDescribedBy?: string;
    displayError?: boolean;
    hint?: string;
    prefixIcon?: string;
    prefixAriaLabel?: string;
    suffixIcon?: string;
    suffixAriaLabel?: string;
    showMaxLength?: number;
    tooltip?: string;
    type?: NuverialInputFieldType;
    validationMessages?: NuverialValidationErrorType;
    type?: string;
    label?: string;
    placeholder?: string;

    // Fromly provided validators
    max?: number;
    min?: number;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  }
  ```

### Example guide for creating a new form component

When building a new form component start by choosing an existing component that is close to what you will build and copy that component.

If I were building a component that is similar to `textInput` component, I would do the following

- Copy the text input component
- Rename the files and the class names
- Rename the selector in the formly component model
- Register the new Formly component in `form-renderer.module`

```typescript
FormlyModule.forRoot({
  types: [
    { component: FormlyMyNewComponent, name: 'nuverialNewComponent' },
  ]
}),
```

- Register the new Formio component in `form-builder-component`

```typescript
constructor(private readonly _injector: Injector) {
  registerMyNewComponent(this._injector);
}
```

- Build the logic for the formly component:
  - Serve the public client and navigate to <http://localhost:4200/main/intake> to see the intake screen
  - Update the json configuration to support the new component in `form-renderer.mock`
  - Update the new component logic, most of the updates will be done in `formly-my-new.component`
  - Serve the agency client and navigate to <http://localhost:4201/main/review> to see the review screen
- Build the logic for the formio component:
  - Serve the agency client and navigate to <http://localhost:4201/admin/builder> to see the builder screen
  - Update the new component logic, some of the work will be done in the html file, but most of the work is done in `formio-my-new.model`
    - We are using base models to make the formio json configurations reusable, but some configuration is specific to a component and should be stored with the component model.
