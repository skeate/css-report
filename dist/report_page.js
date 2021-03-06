/* global LightRouter, _ */

'use strict';

var router = new LightRouter({
  type: 'hash',
  routes: {
    // I guess LightRouter doesn't like including .s in its {} params
    'files/{fileHash}': function filesFileHash(params) {
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

document.getElementById('nav').innerHTML = tmpl('nav-tmpl', { files: Object.keys(sourceFiles) });

function showErrors(filename) {
  var codeTag = document.getElementById('code');
  var code = codeTag.innerHTML;
  var issues = getIssuesByFilename(filename);
  var lines = code.split('\n').map(function (line) {
    return line.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
  });
  issues.forEach(function (issue) {
    var multiline = issue.startLine !== issue.endLine;
    var codeString;
    var message = issue.message.replace(/"/g, '\'');
    if (!multiline) {
      codeString = lines[issue.startLine - 1].substr(issue.startColumn, issue.endColumn);
      code = code.replace(codeString, '<span class="' + issue.type + '" title="' + message + '">' + codeString + '</span>');
    }
  });
  codeTag.innerHTML = code;
}

function getIssuesByFilename(filename) {
  return reportData.filter(function (issue) {
    return issue.file === filename;
  });
}

function showStats(filename) {
  var data = {
    types: {}
  };
  var issues = getIssuesByFilename(filename);
  issues.forEach(function (issue) {
    if (!data.types.hasOwnProperty(issue.type)) {
      data.types[issue.type] = 1;
    } else {
      data.types[issue.type]++;
    }
  });
  document.getElementById('stats').innerHTML = tmpl('stats-tmpl', data);
}
//# sourceMappingURL=data:application/json;base64,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QW1CLENBQUMsUUFBUSxFQUFFO0FBQ3JDLFNBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUN2QyxXQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0dBQ2hDLENBQUMsQ0FBQztDQUNKOztBQUVELFNBQVMsU0FBUyxDQUFDLFFBQVEsRUFBRTtBQUMzQixNQUFJLElBQUksR0FBRztBQUNULFNBQUssRUFBRSxFQUFFO0dBQ1YsQ0FBQztBQUNGLE1BQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLFFBQU0sQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDN0IsUUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMxQyxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDNUIsTUFBTTtBQUNMLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7S0FDMUI7R0FDRixDQUFDLENBQUM7QUFDSCxVQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3ZFIiwiZmlsZSI6InJlcG9ydF9wYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIExpZ2h0Um91dGVyLCBfICovXG5cbnZhciByb3V0ZXIgPSBuZXcgTGlnaHRSb3V0ZXIoe1xuICB0eXBlOiAnaGFzaCcsXG4gIHJvdXRlczoge1xuICAgIC8vIEkgZ3Vlc3MgTGlnaHRSb3V0ZXIgZG9lc24ndCBsaWtlIGluY2x1ZGluZyAucyBpbiBpdHMge30gcGFyYW1zXG4gICAgJ2ZpbGVzL3tmaWxlSGFzaH0nOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgIHBhcmFtcy5maWxlID0gcGFyYW1zLmZpbGUucmVwbGFjZSgvLS9nLCAnLycpO1xuICAgICAgdmFyIGZpbGVOYW1lID0gcGFyYW1zLmZpbGUgKyAnLicgKyBwYXJhbXMuZXh0O1xuICAgICAgdmFyIHNvdXJjZUZpbGU7XG4gICAgICBmb3IgKHZhciBzb3VyY2VGaWxlTmFtZSBpbiBzb3VyY2VGaWxlcykge1xuICAgICAgICBpZiAoc291cmNlRmlsZXNbc291cmNlRmlsZU5hbWVdLmhhc2ggPT09IGZpbGVIYXNoKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHNvdXJjZUZpbGVzW3NvdXJjZUZpbGVOYW1lXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGUnKS5pbm5lckhUTUwgPSBzb3VyY2VGaWxlO1xuICAgICAgc2hvd0Vycm9ycyhmaWxlTmFtZSk7XG4gICAgICBzaG93U3RhdHMoZmlsZU5hbWUpO1xuICAgIH1cbiAgfVxufSk7XG5cbnJvdXRlci5ydW4oKTtcblxud2luZG93Lm9uaGFzaGNoYW5nZSA9IHJvdXRlci5ydW4uYmluZChyb3V0ZXIpO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2JykuaW5uZXJIVE1MID0gdG1wbChcbiAgJ25hdi10bXBsJyxcbiAge2ZpbGVzOiBPYmplY3Qua2V5cyhzb3VyY2VGaWxlcyl9XG4pO1xuXG5mdW5jdGlvbiBzaG93RXJyb3JzKGZpbGVuYW1lKSB7XG4gIHZhciBjb2RlVGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGUnKTtcbiAgdmFyIGNvZGUgPSBjb2RlVGFnLmlubmVySFRNTDtcbiAgdmFyIGlzc3VlcyA9IGdldElzc3Vlc0J5RmlsZW5hbWUoZmlsZW5hbWUpO1xuICB2YXIgbGluZXMgPSBjb2RlLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgIHJldHVybiBsaW5lXG4gICAgICAucmVwbGFjZSgvJmd0Oy9nLCAnPicpXG4gICAgICAucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXG4gICAgO1xuICB9KTtcbiAgaXNzdWVzLmZvckVhY2goZnVuY3Rpb24oaXNzdWUpIHtcbiAgICB2YXIgbXVsdGlsaW5lID0gaXNzdWUuc3RhcnRMaW5lICE9PSBpc3N1ZS5lbmRMaW5lO1xuICAgIHZhciBjb2RlU3RyaW5nO1xuICAgIHZhciBtZXNzYWdlID0gaXNzdWUubWVzc2FnZS5yZXBsYWNlKC9cIi9nLCAnXFwnJyk7XG4gICAgaWYgKCFtdWx0aWxpbmUpIHtcbiAgICAgIGNvZGVTdHJpbmcgPSBsaW5lc1tpc3N1ZS5zdGFydExpbmUgLSAxXVxuICAgICAgICAuc3Vic3RyKGlzc3VlLnN0YXJ0Q29sdW1uLCBpc3N1ZS5lbmRDb2x1bW4pO1xuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZShcbiAgICAgICAgY29kZVN0cmluZyxcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiJyArIGlzc3VlLnR5cGUgKyAnXCIgdGl0bGU9XCInICsgbWVzc2FnZSArICdcIj4nICtcbiAgICAgICAgICBjb2RlU3RyaW5nICtcbiAgICAgICAgJzwvc3Bhbj4nXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG4gIGNvZGVUYWcuaW5uZXJIVE1MID0gY29kZTtcbn1cblxuZnVuY3Rpb24gZ2V0SXNzdWVzQnlGaWxlbmFtZShmaWxlbmFtZSkge1xuICByZXR1cm4gcmVwb3J0RGF0YS5maWx0ZXIoZnVuY3Rpb24oaXNzdWUpIHtcbiAgICByZXR1cm4gaXNzdWUuZmlsZSA9PT0gZmlsZW5hbWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzaG93U3RhdHMoZmlsZW5hbWUpIHtcbiAgdmFyIGRhdGEgPSB7XG4gICAgdHlwZXM6IHt9XG4gIH07XG4gIHZhciBpc3N1ZXMgPSBnZXRJc3N1ZXNCeUZpbGVuYW1lKGZpbGVuYW1lKTtcbiAgaXNzdWVzLmZvckVhY2goZnVuY3Rpb24oaXNzdWUpIHtcbiAgICBpZiAoIWRhdGEudHlwZXMuaGFzT3duUHJvcGVydHkoaXNzdWUudHlwZSkpIHtcbiAgICAgIGRhdGEudHlwZXNbaXNzdWUudHlwZV0gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLnR5cGVzW2lzc3VlLnR5cGVdKys7XG4gICAgfVxuICB9KTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRzJykuaW5uZXJIVE1MID0gdG1wbCgnc3RhdHMtdG1wbCcsIGRhdGEpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9