const config = require('semantic-release-preconfigured-conventional-commits');

const publishCommands = `
git tag -a -f \${nextRelease.version} \${nextRelease.version} -F CHANGELOG.md || exit 2
git push --force origin \${nextRelease.version} || exit 3
`;

const releaseBranches = ['main'];
config.branches = releaseBranches;

config.plugins = [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
        '@semantic-release/changelog',
        {
            changelogFile: 'CHANGELOG.md',
            changelogTitle: '# Changelog\n\nAll notable changes to this project will be documented in this file.'
        }
    ],
    [
        '@semantic-release/exec',
        {
            prepareCmd: 'pnpm install && pnpm build',
            publishCmd: publishCommands,
        },
    ],
    [
        '@semantic-release/git',
        {
            assets: ['CHANGELOG.md', 'package.json'],
            message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
        }
    ],
    [
        "@semantic-release/gitlab",
        {
            "gitlabUrl": "https://gitlab.uzinfocom.uz",
            "gitlabApiPathPrefix": "/api/v4"
        }
    ]
];

module.exports = config;