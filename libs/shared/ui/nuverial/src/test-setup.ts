import 'jest-preset-angular/setup-jest';

import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Stop's warning message from displaying stack trace
// eslint-disable-next-line no-console
console.warn = function (msg) {
  return msg;
};
