// Common Storybook objects
export const booleanArgType = (desc: string) => {
  return {
    control: {
      type: 'boolean',
    },
    defaultValue: false,
    description: desc,
    type: {
      name: 'boolean',
      required: false,
    },
  };
};

export const stringArgType = (desc: string) => {
  return {
    defaultValue: '',
    description: desc,
    type: {
      name: 'string',
      required: false,
    },
  };
};
