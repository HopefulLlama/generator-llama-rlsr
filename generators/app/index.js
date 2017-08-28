const path = require('path');

const Generator = require('yeoman-generator');

function getRepository(username, projectName) {
  return `\"repository\": {
    \"type\": \"git\",
    \"url\": \"git+https://github.com/${username}/${projectName}.git\"
  },`;
}

function getIssuesPage(username, projectName) {
  return `https://github.com/${username}/${projectName}/issues`;
}

function getBugs(username, projectName) {
  return `\"bugs\": {
    \"url\": \"${getIssuesPage(username, projectName)}\"
  },`;
}

function getHomePage(username, projectName) {
  return `"homepage": "https://github.com/${username}/${projectName}#readme",`;
}

function isValid(items) {
  return items.every((item) => {
    return item !== undefined && item !== null && item !== '';
  });
}

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name', 
      message: 'What is the name of your module (will be prefixed with \'llama-rlsr\')?',
      required: true
    }, {
      type: 'input',
      name: 'prettyName', 
      message: 'What is the pretty name of your module?',
      required: true
    }, {
      type: 'input',
      name: 'email',
      message: 'What is your e-mail address?',
      required: true
    }, {
      type: 'input',
      name: 'gitHubUser',
      message: 'What is your GitHub username (leave blank if this is not a GitHub project)?'
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  writing() {
    if(isValid([this.answers.name, this.answers.prettyName, this.answers.email])) {
      this.valid = true;

      let properties = {
        name: `llama-rlsr-${this.answers.name}`,
        prettyName: this.answers.prettyName,
        importName: this.answers.prettyName.replace(' ', ''),
        email: this.answers.email,
        repository: '',
        bugs: '',
        homePage: '',
        issues: ''
      };

      let files = [
        'src/llama-rlsr-template.js',
        'spec/unit/llama-rlsr-templateSpec.js',
        '_._gitignore',
        '_._jshintrc',
        'CHANGELOG.md',
        'gulpfile.js',
        'LICENSE',
        'package.json',
        'README.md',
      ];

      if(this.answers.gitHubUser) {
        properties.repository = getRepository(this.answers.gitHubUser, this.answers.name);
        properties.bugs = getBugs(this.answers.gitHubUser, this.answers.name);
        properties.homePage = getHomePage(this.answers.gitHubUser, this.answers.name);
        properties.issues = getIssuesPage(this.answers.gitHubUser, this.answers.name);

        files = files.concat(['CONTRIBUTING.md']);
      }

      files.forEach((f) => {
        this.fs.copyTpl(
          this.templatePath(f),
          this.destinationPath(f.replace('_._', '.').replace('template', this.answers.name)),
          properties
        );
      });
    } else {
      this.log('Name, pretty name and e-mail are required fields.');
      this.valid = false;
    }
  }

  install() {
    if(this.valid) {
      this.npmInstall();
    }
  }
};