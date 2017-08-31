const fs = require('fs');
const path = require('path');
const yeomanTest = require('yeoman-test');

const routeToGenerator = path.join(__dirname, '../../generators/app');

describe('Default Generator', () => {
  let properties;
  let baseFiles = [
    '.gitignore',
    '.jshintrc',
    'CHANGELOG.md',
    'gulpfile.js',
    'LICENSE',
    'package.json',
    'README.md'
  ];

  const defaultAdditionalFiles = [
    'spec/unit/llama-rlsr-test-moduleSpec.js',
    'src/llama-rlsr-test-module.js'
  ];

  const gitHubUserFiles = [
    'CONTRIBUTING.md'
  ];

  function generateMockApp() {
    return yeomanTest
    .run(routeToGenerator)
    .withPrompts(properties);
  }

  function checkFileExists(exists, file) {
    expect(fs.existsSync(file)).toBe(exists, file);
  }

  beforeEach(() => {
    properties = {
      name: 'test-module',
      prettyName: 'Test Module',
      email: 'mock@test.com'
    };
  });

  describe('without GitHub username', () => {
    it('should create the correct files', (done) => {
      generateMockApp()
      .then(() => {
        baseFiles
        .concat(defaultAdditionalFiles)
        .forEach(checkFileExists.bind(null, true));

        gitHubUserFiles.forEach(checkFileExists.bind(null, false));

        done();
      });
    });

    it('should create different file names depending on the given name', (done) => {
      properties.name = 'new-name';
      
      generateMockApp()
      .then(() => {
        baseFiles.concat([
          'spec/unit/llama-rlsr-new-nameSpec.js',
          'src/llama-rlsr-new-name.js'
        ]).forEach(checkFileExists.bind(null, true));

        gitHubUserFiles.forEach(checkFileExists.bind(null, false));
        done();
      });
    });
  });

  describe('with GitHub username', () => {
    beforeEach(() => {
      properties.gitHubUser = 'MockTest';
    });

    it('should create correct files', (done) => {
      generateMockApp()
      .then(() => {
        baseFiles
        .concat(defaultAdditionalFiles)
        .concat(gitHubUserFiles)
        .forEach(checkFileExists.bind(null, true));

        done();
      });
    });
  });
});