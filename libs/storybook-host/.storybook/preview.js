import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';

setCompodocJson(docJson);

// handle loading the about docs page on initial load
const clickDocsButtonOnFirstLoad = () => {
  window.removeEventListener('load', clickDocsButtonOnFirstLoad);

  // eslint-disable-next-line no-undef
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  if (params.id !== 'dsg--about') return;

  try {
    const docsButtonSelector = window.parent.document.evaluate("//button[contains(., 'Docs')]", window.parent.document, null, XPathResult.ANY_TYPE, null);
    const button = docsButtonSelector.iterateNext();
    button.click();
  } catch (error) {
    // Do nothing if it wasn't able to click on Docs button.
  }
};

window.addEventListener('load', clickDocsButtonOnFirstLoad);

export const parameters = {
  html: {
    removeEmptyComments: true,
    transform: code => code.replace(/(?:_nghost|ng-reflect|_ngcontent).*?="[\S\s]*?"/g, ''),
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['About', 'Nuverial', 'Forms', 'Theme', ['About', '*', 'Development'], '*', 'Development'],
    },
  },
};
