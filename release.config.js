const changelogFile = 'CHANGELOG.md';

module.exports = {
  branch: 'master',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile }],
    ['@semantic-release/git', { assets: [changelogFile] }],
    [
      '@semantic-release/github',
      {
        assignees: 'Ezard',
        assets: [
          {
            path: 'dist/**/!(*.tsbuildinfo)',
            label: 'All Assets',
          },
          {
            path: 'dist/cjs/**/!(*.tsbuildinfo)',
            label: 'CommonJS Assets',
          },
          {
            path: 'dist/esm/**/!(*.tsbuildinfo)',
            label: 'ES2015 Assets',
          },
        ],
      },
    ],
    '@semantic-release/npm',
  ],
};
