import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';

setCompodocJson(docJson);

export const parameters = {
  html: {
    removeEmptyComments: true,
    transform: code => code.replace(/(?:_nghost|ng-reflect|_ngcontent).*?="[\S\s]*?"/g, ''),
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['About'],
    },
  },
};
