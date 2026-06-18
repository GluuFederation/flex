module.exports = {
  config: {
    default: true,
    MD013: false,
    MD024: { siblings_only: true },
  },
  globs: ['**/*.md'],
  ignores: [
    'node_modules',
    'dist',
    'coverage',
    'jans_config_api_orval',
    'jans_config_api',
    '.husky/_',
    '.claude',
    'CHANGELOG.md',
  ],
}
