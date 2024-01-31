import { IRendererFormConfigurationSchema } from '@dsg/shared/data-access/work-api';

export const personalInformationMock: IRendererFormConfigurationSchema[] = [
  {
    key: 'firstName',
    props: {
      label: 'First Name',
      maxLength: 5,
      placeholder: 'Enter first name',
      required: true,
    },
    type: 'nuverialTextInput',
  },
  {
    // className: 'flex-third',
    key: 'lastName',
    props: {
      label: 'Last Name',
      placeholder: 'Enter last name',
      required: true,
    },
    type: 'nuverialTextInput',
  },
  {
    key: 'email',
    props: {
      label: 'Email address',
      placeholder: 'Enter email',
      required: true,
      type: 'email',
    },
    type: 'nuverialTextInput',
    validation: {
      messages: {
        required: 'this is a test',
      },
    },
    validators: {
      validation: ['email'],
    },
  },
  {
    expressions: {
      hide: '!model.email',
      // ['props.disabled']: '!model.firstName && !model.lastName',
    },
    key: 'password',
    props: {
      label: 'Password',
      maxLength: 10,
      minLength: 2,
      placeholder: 'Enter password',
      required: true,
      type: 'password',
    },
    type: 'nuverialTextInput',
  },
  {
    className: 'flex-full',
    key: 'employeeRecent',
    props: {
      colorTheme: 'primary',
      label: 'Recent Employee',
    },
    type: 'nuverialCheckbox',
  },
  {
    className: 'half-width',
    key: 'checkbox-card',
    props: {
      cardContent: 'Example checkbox card content',
      cardTitle: 'Checkbox Card title',
      colorTheme: 'primary',
      imageAltLabel: 'image alternate text2',
      imagePath: '/assets/images/child-performer.jpg',
      imagePosition: 'top',
    },
    type: 'nuverialCheckboxCard',
  },
];

export const FormConfigMock: IRendererFormConfigurationSchema[] = [
  {
    className: 'flex-full',
    fieldGroup: [
      {
        fieldGroup: personalInformationMock,
        props: {
          label: 'Personal',
        },
      },
      {
        fieldGroup: [
          {
            key: 'country',
            props: {
              label: 'Country',
              required: true,
            },
            type: 'nuverialTextInput',
          },
        ],
        props: {
          label: 'Business',
        },
      },
      {
        expressions: {
          // hide: '!model.country',
          ['props.disabled']: '!model.country',
        },
        fieldGroup: [
          {
            key: 'favoriteIceCream',
            props: {
              label: 'Favorite Ice Cream',
              required: true,
            },
            type: 'nuverialTextInput',
          },
        ],
        props: {
          label: 'Step 3',
        },
      },
    ],
    type: 'nuverialSteps',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formDataModelMock: Record<string, any> = {
  email: 'email@gmail.com',
  firstName: 'George',
  lastName: 'Forman',
};
