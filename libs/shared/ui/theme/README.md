# Theme

The theme library primarily defines the colors and typography for use across an application together with mixins that maybe optionally used to style common components.

## Colors and Typography

The theme uses CSS variables to define colors and typography for use by an application. Prior to use the following files must be updated to define an applications theme.

Within the theme library, CSS variables are named using the following convention `--theme-color` or `--theme-typography`

```
@dsg/shared-theme/partials/variables/_colors.scss
@dsg/shared-theme/partials/variables/_typography.scss
```

## Material Design

The Nuverial component library has dependencies on the Angular Material Design component library. In order for Material to be initialized correctly a theme definition must defined and registered by updating the file `@dsg/shared-theme/styles/angular-material-theme.scss`

## Usage

To include the theme library within an application add the following line to the applications styles.scss file

```scss
@use '@dsg/shared-theme';
```

## Assets

To use the assets in an app, add the following code to the `assets` array in `apps/<projectName>/project.json`:

```json
{
  "glob": "**/*",
  "input": "libs/shared/ui/theme/assets/",
  "output": "/assets/"
}
```

## Mixins

Mixin functions are located in the `@dsg/shared-theme/partials/mixins` folder and organised by type e.g. table

### Form Fields

Styling form fields primarily for focus and error styling.

```angular
@use '@dsg/shared-theme/partials/mixins' as mixins; @include mixins.formField-styleFormField();
```

### Tables

Styling for tables, sort header and paginator can be achieved by incorporating the mixins `components.styleTable()` and for mobile layouts `components.styleTableMobile()`.

The row layout for mobile results in a two column 'card' where column data may reside on the left/right side of the card. The layout relies on the CSS classes created by Material for each column e.g. `.mat-column-date`. A SASS map is required and passed to the mixin to style each column and supply optional 'before' content data.

```scss
@use '@dsg/shared-theme/partials/mixins' as mixins;

.my-table {
  @include mixins.table-styleTable();

  $columns: (
    date: (
      order: 1,
      width: 50%,
    ),
    id: (
      content: 'App ID:',
      order: 2,
      justify-content: 'flex-end',
      width: 50%,
    ),
    idStatus: (
      order: 3,
      justify-content: 'flex-end',
      width: 50%,
    ),
    email: (
      order: 4,
      width: 100%,
    ),
    name: (
      order: 5,
      width: 100%,
    ),
  );
  @include mixins.table-styleTableMobile($columns);
}
```

### Tooltip

Styling for material tooltips.

Tooltips display in an overlay container and are styled globally. Add the following to the applications styles.scss.

```scss
@use '@dsg/shared-theme/partials/mixins' as mixins;
@include mixins.toolTip-styleTooltip();
```

### SnackBar

Styling for material SnackBars.

SnackBars display in an overlay container and are styled globally. Add the following to the applications styles.scss.

```scss
@use '@dsg/shared-theme/partials/mixins' as mixins;
@include mixins.snackBar-styleSnackBar();
```

### Checkbox

Styling for material checkbox.

Checkbox and checkbox card global styling. Add the following to the applications styles.scss.

```scss
@use '@dsg/shared-theme/partials/mixins' as mixins;
@include mixins.checkbox-styleCheckbox();
```
