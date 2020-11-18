const changelogFile = 'CHANGELOG.md';

module.exports = {
  branch: 'master',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/github', { assignees: 'Ezard' }],
    '@semantic-release/npm',
    ['@semantic-release/changelog', { changelogFile }],
    [
      '@semantic-release/git',
      {
        assets: [changelogFile, 'package.json', 'package-lock.json'],
      },
    ],
  ],
};
