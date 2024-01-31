const rootMain = require('../../../.storybook/main');

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: 'webpack5' },
  stories: [
    ...rootMain.stories,
    // get all stories in all libraries
    '../../**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  staticDirs: [{ from: '../../shared/ui/theme/.storybook/assets', to: '/assets' }],
  addons: [...rootMain.addons],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    // add your own webpack tweaks if needed

    return config;
  },
  managerHead: (head, { configType }) => {
    if (configType === 'PRODUCTION') {
      return `
        ${head}
        <base href="/dsgov-web/">
      `;
    }

    return `
      ${head}
      <base href="/">
    `;
  },
};
