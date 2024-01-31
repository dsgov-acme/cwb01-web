# Conditionals

Conditionals are used to conditionally hide, disable, or require, form fields depending on specific user interactions with the form

## Table of Contents

- [Conditionals](#conditionals)
  - [Table of Contents](#table-of-contents)
  - [Form builder conditional guidelines](#form-builder-conditional-guidelines)
    - [Developer links](#developer-links)
    - [Conditional options](#conditional-options)
      - [Hide](#hide)
      - [Disable](#disable)
      - [Require](#require)
    - [Use cases](#use-cases)
      - [To conditionally hide and require a field](#to-conditionally-hide-and-require-a-field)
      - [Conditionally hide a field when value is set'](#conditionally-hide-a-field-when-value-is-set)
      - [Conditionally hide a field when a specific value is selected](#conditionally-hide-a-field-when-a-specific-value-is-selected)

## Form builder conditional guidelines

Every input form field has a conditional panel that allows the ability to conditionally hide, disable, or require a form field depending on user inputs.

![Text input builder validation](assets/builder/text-input-builder-conditional.png)

### Developer links

- [Formly expressions](https://formly.dev/docs/guide/expression-properties/) - We use formly expressions to handle our conditional logic

### Conditional options

Conditional logic is dependant on the model property name, this property name must coincide with the property key name defined in the [display panel](/docs/dsg-forms--display#property-key-name)

![Field display key](assets/builder/text-input-display-key.png)

#### Hide

Used to conditionally hide a field.

- When a required field is hidden, it will not be required unless the conditional hide logic is truthy
- To conditionally require and hide a specific field see the [use case](#to-conditionally-hide-and-require-a-field)

To conditionally hide a field depending on a field value with a key of `personalInformation.firstName` set the logic to:

```test
!model.personalInformation?.firstName
```

#### Disable

Used to conditionally disable a field, the field will be visible but will be disabled.

To conditionally disable a field depending on a field value with a key of `personalInformation.firstName` set the logic to:

```test
!model.personalInformation?.firstName
```

#### Require

Used to conditionally require a field, the field will always be visible but will conditionally be required, in most cases you will want to [conditionally hide and require](#to-conditionally-hide-and-require-a-field) a field.

- This option will take precedence over required validation if it is set

To conditionally disable a field depending on a field value with a key of `personalInformation.firstName` set the logic to:

```test
model.personalInformation?.firstName
```

### Use cases

The following examples show how to implement specific use cases

#### To conditionally hide and require a field

Example:

![Field conditional hide required](assets/builder/field-conditional-hide-required.png)

Set the required field validation

![Text input required](assets/builder/text-input-required.png)

Set the conditional hide

```text
!model.personalInformation?.currentAddress?.isMailingAddressDifferent
```

![Text input conditional hide](assets/builder/text-input-conditional-hide.png)

#### Conditionally hide a field when value is set'

Example: ![Text input builder validation](assets/builder/is-address-different-checked.png)

Set the conditional hide

```text
!model.personalInformation?.currentAddress?.isMailingAddressDifferent
```

![Text input conditional hide](assets/builder/text-input-conditional-hide.png)

#### Conditionally hide a field when a specific value is selected

Different fields are shown depending on which value is selected

Example: ![Selected value conditional fields](assets/builder/selected-value-conditional-fields.png)

Set the conditional hide

```text
model.employmentInformation?.employmentStatus !== 'employed' && model.employmentInformation?.employmentStatus !== 'selfEmployed'
```

or

```text
model.employmentInformation?.employmentStatus === 'employed'
```

![Text input conditional hide on specific value](assets/builder/field-conditional-hide-specific-value.png)
