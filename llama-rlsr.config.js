const LlamaRlsrNpm = require('llama-rlsr-npm');
const LlamaRlsrKeepAChangelog = require('llama-rlsr-keep-a-changelog');
const simpleGit = require('simple-git')(process.cwd());
const GitHubApi = require('github-api');

const gitHubCredentials = require('./credentials/github.json');

if(!gitHubCredentials) {
  throw new Error('GitHub credentials not found.');
}

module.exports = {
  preRelease: [
    LlamaRlsrNpm.updateVersion(),
    LlamaRlsrKeepAChangelog.updateChangelog({
      placeholder: '- Nothing yet'
    }),
    LlamaRlsrKeepAChangelog.updateDiff({
      urlGenerator: (oldVersion, newVersion) => {
        return `https://github.com/HopefulLlama/generator-llama-rlsr/compare/${oldVersion}...${newVersion}`;
      },
      latest: 'HEAD',
      tag: {
        prefix: 'v'
      }
    })
  ],
  release: [
    (versionMetadata, done) => {
      simpleGit.add(['package.json', 'CHANGELOG.md', 'llama-rlsr.metadata.json'], () => {
        simpleGit.commit(`Update to version ${versionMetadata.newVersion}`, () => {
          simpleGit.addTag(`v${versionMetadata.newVersion}`, () => {
            simpleGit.push('origin', 'master', () => {
              simpleGit.pushTags('origin', () => {
                done();
              });
            });
          });
        });
      });
    },
    (versionMetadata, done) => {
      let gitHub = new GitHubApi(gitHubCredentials);
      gitHub
      .getRepo('HopefulLlama', 'generator-llama-rlsr')
      .createRelease({"tag_name": `v${versionMetadata.newVersion}`}, () => {
        done();
      });
    }
  ]
};