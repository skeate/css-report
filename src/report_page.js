/* global LightRouter, _ */

var router = new LightRouter({
  type: 'hash',
  routes: {
    // I guess LightRouter doesn't like including .s in its {} params
    'files/{fileHash}': function(params) {
      params.file = params.file.replace(/-/g, '/');
      var fileName = params.file + '.' + params.ext;
      var sourceFile;
      for (var sourceFileName in sourceFiles) {
        if (sourceFiles[sourceFileName].hash === fileHash) {
          sourceFile = sourceFiles[sourceFileName];
          break;
        }
      }
      document.getElementById('code').innerHTML = sourceFile;
      showErrors(fileName);
      showStats(fileName);
    }
  }
});

router.run();

window.onhashchange = router.run.bind(router);

document.getElementById('nav').innerHTML = tmpl(
  'nav-tmpl',
  {files: Object.keys(sourceFiles)}
);

function showErrors(filename) {
  var codeTag = document.getElementById('code');
  var code = codeTag.innerHTML;
  var issues = getIssuesByFilename(filename);
  var lines = code.split('\n').map(function(line) {
    return line
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
    ;
  });
  issues.forEach(function(issue) {
    var multiline = issue.startLine !== issue.endLine;
    var codeString;
    var message = issue.message.replace(/"/g, '\'');
    if (!multiline) {
      codeString = lines[issue.startLine - 1]
        .substr(issue.startColumn, issue.endColumn);
      code = code.replace(
        codeString,
        '<span class="' + issue.type + '" title="' + message + '">' +
          codeString +
        '</span>'
      );
    }
  });
  codeTag.innerHTML = code;
}

function getIssuesByFilename(filename) {
  return reportData.filter(function(issue) {
    return issue.file === filename;
  });
}

function showStats(filename) {
  var data = {
    types: {}
  };
  var issues = getIssuesByFilename(filename);
  issues.forEach(function(issue) {
    if (!data.types.hasOwnProperty(issue.type)) {
      data.types[issue.type] = 1;
    } else {
      data.types[issue.type]++;
    }
  });
  document.getElementById('stats').innerHTML = tmpl('stats-tmpl', data);
}
