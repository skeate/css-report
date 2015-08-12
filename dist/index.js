'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.generateCssReport = generateCssReport;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sourceMap = require('source-map');

var _sourceMapResolve = require('source-map-resolve');

var _sourceMapResolve2 = _interopRequireDefault(_sourceMapResolve);

var _analyzeCss = require('analyze-css');

var _analyzeCss2 = _interopRequireDefault(_analyzeCss);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _templates = require('./templates');

var _md5 = require('md5');

var _md52 = _interopRequireDefault(_md5);

_bluebird2['default'].promisifyAll(_fs2['default']);
_bluebird2['default'].promisifyAll(_sourceMapResolve2['default']);

var analyze = function analyze(file) {
  return new _bluebird2['default'](function (resolve, reject) {
    new _analyzeCss2['default'](file, function (err, analysis) {
      if (err) {
        reject(err);
      }
      resolve(analysis);
    });
  });
};

var getSourcemap = function getSourcemap(file, fileName) {
  return _sourceMapResolve2['default'].resolveSourceMapAsync(file, fileName, _fs2['default'].readFile).then(function (obj) {
    return obj.map;
  });
};

function generateCssReport(files) {
  var outputFile = arguments.length <= 1 || arguments[1] === undefined ? 'report.html' : arguments[1];

  var baseDir = process.cwd();
  files.forEach(function (fileName) {
    var fileDir = _path2['default'].dirname(_path2['default'].resolve(fileName));
    _fs2['default'].readFileAsync(fileName, 'utf8').then(function (file) {
      return [getSourcemap(file, fileName), analyze(file)];
    }).spread(function (sourcemap, analysis) {
      var reportData = [];
      var smc = new _sourceMap.SourceMapConsumer(sourcemap);
      Object.keys(analysis.offenders).forEach(function (offenderType) {
        if (offenderType === 'comments') {
          return; // ignore comments since they ought to be minified out anyway
        }
        analysis.offenders[offenderType].forEach(function (offense) {
          if (offense.position) {
            var originalStart = smc.originalPositionFor(offense.position.start);
            var originalEnd = smc.originalPositionFor(offense.position.end);
            if (!originalStart.source) {
              console.log('no source file found for offense', offense);
              console.log('sourcemap consumer data: ');
              console.log(originalStart);
              console.log(originalEnd);
              return;
            }
            var fullPath = _path2['default'].resolve(_path2['default'].join(fileDir, originalStart.source));
            var relaPath = _path2['default'].relative(baseDir, fullPath);
            console.log('baseDir', baseDir);
            console.log('fullPath', fullPath);
            console.log('fileDir', fileDir);
            console.log('relaPath', relaPath);
            reportData.push({
              fileHash: (0, _md52['default'])(relaPath),
              file: relaPath,
              type: offenderType,
              message: offense.message,
              startLine: originalStart.line,
              endLine: originalEnd.line,
              startColumn: originalStart.column,
              endColumn: originalEnd.column
            });
          }
        });
      });

      var files = _lodash2['default'].map(_lodash2['default'].filter(_lodash2['default'].uniq(_lodash2['default'].pluck(reportData, 'file'))), function (file) {
        return _path2['default'].join(baseDir, file);
      });
      return [reportData, files.map(function (fn) {
        return _path2['default'].relative(baseDir, fn);
      }), _bluebird2['default'].all(files.map(function (f) {
        return _fs2['default'].readFileAsync(f, 'utf8');
      }))];
    }).spread(function (reportData, sourceFileNames, sourceFileContents) {
      return _fs2['default'].writeFileAsync(outputFile, _templates.tmpl['src/report']({
        reportData: JSON.stringify(reportData),
        sourceFiles: JSON.stringify(_lodash2['default'].map(_lodash2['default'].zipObject(sourceFileNames, sourceFileContents), function (v, k) {
          return {
            contents: v,
            hash: (0, _md52['default'])(k)
          };
        }))
      }));
    })['catch'](function (err) {
      console.error(err.stack);
      process.exit(1);
    });
  });
}
//# sourceMappingURL=data:application/json;base64,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LENBQUMsQ0FBQztPQUNqQyxDQUFDLENBQUM7QUFDSCxhQUFPLENBQ0wsVUFBVSxFQUNWLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxFQUFFO2VBQUksa0JBQUssUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7T0FBQSxDQUFDLEVBQzNDLHNCQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztlQUFJLGdCQUFHLGFBQWEsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDLENBQ25ELENBQUM7S0FDSCxDQUFDLENBQ0QsTUFBTSxDQUFDLFVBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBSztBQUMzRCxhQUFPLGdCQUFHLGNBQWMsQ0FBQyxVQUFVLEVBQUUsV0E5RWxDLElBQUksQ0E4RW1DLFlBQVksQ0FBQyxDQUFDO0FBQ3RELGtCQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7QUFDdEMsbUJBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUN6QixvQkFBRSxHQUFHLENBQUMsb0JBQUUsU0FBUyxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUNoRSxpQkFBTztBQUNMLG9CQUFRLEVBQUUsQ0FBQztBQUNYLGdCQUFJLEVBQUUsc0JBQUksQ0FBQyxDQUFDO1dBQ2IsQ0FBQztTQUNILENBQUMsQ0FDSDtPQUNGLENBQUMsQ0FBQyxDQUFDO0tBQ0wsQ0FBQyxTQUNJLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDWixhQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixhQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTb3VyY2VNYXBDb25zdW1lciB9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0IHNvdXJjZU1hcFJlc29sdmUgZnJvbSAnc291cmNlLW1hcC1yZXNvbHZlJztcbmltcG9ydCBhbmFseXplciBmcm9tICdhbmFseXplLWNzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IFAgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IHRtcGwgfSBmcm9tICcuL3RlbXBsYXRlcyc7XG5pbXBvcnQgbWQ1IGZyb20gJ21kNSc7XG5cblAucHJvbWlzaWZ5QWxsKGZzKTtcblAucHJvbWlzaWZ5QWxsKHNvdXJjZU1hcFJlc29sdmUpO1xuXG5sZXQgYW5hbHl6ZSA9IChmaWxlKSA9PiB7XG4gIHJldHVybiBuZXcgUCgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbmV3IGFuYWx5emVyKGZpbGUsIChlcnIsIGFuYWx5c2lzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShhbmFseXNpcyk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxubGV0IGdldFNvdXJjZW1hcCA9IChmaWxlLCBmaWxlTmFtZSkgPT4ge1xuICByZXR1cm4gc291cmNlTWFwUmVzb2x2ZS5yZXNvbHZlU291cmNlTWFwQXN5bmMoZmlsZSwgZmlsZU5hbWUsIGZzLnJlYWRGaWxlKVxuICAgIC50aGVuKG9iaiA9PiBvYmoubWFwKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUNzc1JlcG9ydChmaWxlcywgb3V0cHV0RmlsZSA9ICdyZXBvcnQuaHRtbCcpIHtcbiAgbGV0IGJhc2VEaXIgPSBwcm9jZXNzLmN3ZCgpO1xuICBmaWxlcy5mb3JFYWNoKGZpbGVOYW1lID0+IHtcbiAgICBsZXQgZmlsZURpciA9IHBhdGguZGlybmFtZShwYXRoLnJlc29sdmUoZmlsZU5hbWUpKTtcbiAgICBmcy5yZWFkRmlsZUFzeW5jKGZpbGVOYW1lLCAndXRmOCcpXG4gICAgLnRoZW4oZmlsZSA9PiBbZ2V0U291cmNlbWFwKGZpbGUsIGZpbGVOYW1lKSwgYW5hbHl6ZShmaWxlKV0pXG4gICAgLnNwcmVhZCgoc291cmNlbWFwLCBhbmFseXNpcykgPT4ge1xuICAgICAgbGV0IHJlcG9ydERhdGEgPSBbXTtcbiAgICAgIGxldCBzbWMgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoc291cmNlbWFwKTtcbiAgICAgIE9iamVjdC5rZXlzKGFuYWx5c2lzLm9mZmVuZGVycykuZm9yRWFjaChvZmZlbmRlclR5cGUgPT4ge1xuICAgICAgICBpZiAob2ZmZW5kZXJUeXBlID09PSAnY29tbWVudHMnKSB7XG4gICAgICAgICAgcmV0dXJuOyAvLyBpZ25vcmUgY29tbWVudHMgc2luY2UgdGhleSBvdWdodCB0byBiZSBtaW5pZmllZCBvdXQgYW55d2F5XG4gICAgICAgIH1cbiAgICAgICAgYW5hbHlzaXMub2ZmZW5kZXJzW29mZmVuZGVyVHlwZV0uZm9yRWFjaChvZmZlbnNlID0+IHtcbiAgICAgICAgICBpZiAob2ZmZW5zZS5wb3NpdGlvbikge1xuICAgICAgICAgICAgbGV0IG9yaWdpbmFsU3RhcnQgPSBzbWMub3JpZ2luYWxQb3NpdGlvbkZvcihvZmZlbnNlLnBvc2l0aW9uLnN0YXJ0KTtcbiAgICAgICAgICAgIGxldCBvcmlnaW5hbEVuZCAgID0gc21jLm9yaWdpbmFsUG9zaXRpb25Gb3Iob2ZmZW5zZS5wb3NpdGlvbi5lbmQpO1xuICAgICAgICAgICAgaWYgKCFvcmlnaW5hbFN0YXJ0LnNvdXJjZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gc291cmNlIGZpbGUgZm91bmQgZm9yIG9mZmVuc2UnLCBvZmZlbnNlKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NvdXJjZW1hcCBjb25zdW1lciBkYXRhOiAnKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cob3JpZ2luYWxTdGFydCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9yaWdpbmFsRW5kKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGZ1bGxQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgICAgICAgICBwYXRoLmpvaW4oZmlsZURpciwgb3JpZ2luYWxTdGFydC5zb3VyY2UpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IHJlbGFQYXRoID0gcGF0aC5yZWxhdGl2ZShiYXNlRGlyLCBmdWxsUGF0aCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYmFzZURpcicsIGJhc2VEaXIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Z1bGxQYXRoJywgZnVsbFBhdGgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbGVEaXInLCBmaWxlRGlyKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWxhUGF0aCcsIHJlbGFQYXRoKTtcbiAgICAgICAgICAgIHJlcG9ydERhdGEucHVzaCh7XG4gICAgICAgICAgICAgIGZpbGVIYXNoOiAgICBtZDUocmVsYVBhdGgpLFxuICAgICAgICAgICAgICBmaWxlOiAgICAgICAgcmVsYVBhdGgsXG4gICAgICAgICAgICAgIHR5cGU6ICAgICAgICBvZmZlbmRlclR5cGUsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICAgICBvZmZlbnNlLm1lc3NhZ2UsXG4gICAgICAgICAgICAgIHN0YXJ0TGluZTogICBvcmlnaW5hbFN0YXJ0LmxpbmUsXG4gICAgICAgICAgICAgIGVuZExpbmU6ICAgICBvcmlnaW5hbEVuZC5saW5lLFxuICAgICAgICAgICAgICBzdGFydENvbHVtbjogb3JpZ2luYWxTdGFydC5jb2x1bW4sXG4gICAgICAgICAgICAgIGVuZENvbHVtbjogICBvcmlnaW5hbEVuZC5jb2x1bW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IGZpbGVzID0gXy5tYXAoXy5maWx0ZXIoXy51bmlxKF8ucGx1Y2socmVwb3J0RGF0YSwgJ2ZpbGUnKSkpLCBmaWxlID0+IHtcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihiYXNlRGlyLCBmaWxlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgcmVwb3J0RGF0YSxcbiAgICAgICAgZmlsZXMubWFwKGZuID0+IHBhdGgucmVsYXRpdmUoYmFzZURpciwgZm4pKSxcbiAgICAgICAgUC5hbGwoZmlsZXMubWFwKGYgPT4gZnMucmVhZEZpbGVBc3luYyhmLCAndXRmOCcpKSlcbiAgICAgIF07XG4gICAgfSlcbiAgICAuc3ByZWFkKChyZXBvcnREYXRhLCBzb3VyY2VGaWxlTmFtZXMsIHNvdXJjZUZpbGVDb250ZW50cykgPT4ge1xuICAgICAgcmV0dXJuIGZzLndyaXRlRmlsZUFzeW5jKG91dHB1dEZpbGUsIHRtcGxbJ3NyYy9yZXBvcnQnXSh7XG4gICAgICAgIHJlcG9ydERhdGE6IEpTT04uc3RyaW5naWZ5KHJlcG9ydERhdGEpLFxuICAgICAgICBzb3VyY2VGaWxlczogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgXy5tYXAoXy56aXBPYmplY3Qoc291cmNlRmlsZU5hbWVzLCBzb3VyY2VGaWxlQ29udGVudHMpLCAodiwgaykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY29udGVudHM6IHYsXG4gICAgICAgICAgICAgIGhhc2g6IG1kNShrKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9KSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=