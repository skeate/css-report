import path from 'path';
import { SourceMapConsumer } from 'source-map';
import sourceMapResolve from 'source-map-resolve';
import analyzer from 'analyze-css';
import fs from 'fs';
import P from 'bluebird';
import _ from 'lodash';
import { tmpl } from './templates';
import md5 from 'md5';

P.promisifyAll(fs);
P.promisifyAll(sourceMapResolve);

let analyze = (file) => {
  return new P((resolve, reject) => {
    new analyzer(file, (err, analysis) => {
      if (err) {
        reject(err);
      }
      resolve(analysis);
    });
  });
};

let getSourcemap = (file, fileName) => {
  return sourceMapResolve.resolveSourceMapAsync(file, fileName, fs.readFile)
    .then(obj => obj.map);
};

export function generateCssReport(files, outputFile = 'report.html') {
  let baseDir = process.cwd();
  files.forEach(fileName => {
    let fileDir = path.dirname(path.resolve(fileName));
    fs.readFileAsync(fileName, 'utf8')
    .then(file => [getSourcemap(file, fileName), analyze(file)])
    .spread((sourcemap, analysis) => {
      let reportData = [];
      let smc = new SourceMapConsumer(sourcemap);
      Object.keys(analysis.offenders).forEach(offenderType => {
        if (offenderType === 'comments') {
          return; // ignore comments since they ought to be minified out anyway
        }
        analysis.offenders[offenderType].forEach(offense => {
          if (offense.position) {
            let originalStart = smc.originalPositionFor(offense.position.start);
            let originalEnd   = smc.originalPositionFor(offense.position.end);
            if (!originalStart.source) {
              console.log('no source file found for offense', offense);
              console.log('sourcemap consumer data: ');
              console.log(originalStart);
              console.log(originalEnd);
              return;
            }
            let fullPath = path.resolve(
              path.join(fileDir, originalStart.source)
            );
            let relaPath = path.relative(baseDir, fullPath);
            console.log('baseDir', baseDir);
            console.log('fullPath', fullPath);
            console.log('fileDir', fileDir);
            console.log('relaPath', relaPath);
            reportData.push({
              fileHash:    md5(relaPath),
              file:        relaPath,
              type:        offenderType,
              message:     offense.message,
              startLine:   originalStart.line,
              endLine:     originalEnd.line,
              startColumn: originalStart.column,
              endColumn:   originalEnd.column
            });
          }
        });
      });

      let files = _.map(_.filter(_.uniq(_.pluck(reportData, 'file'))), file => {
        return path.join(baseDir, file);
      });
      return [
        reportData,
        files.map(fn => path.relative(baseDir, fn)),
        P.all(files.map(f => fs.readFileAsync(f, 'utf8')))
      ];
    })
    .spread((reportData, sourceFileNames, sourceFileContents) => {
      return fs.writeFileAsync(outputFile, tmpl['src/report']({
        reportData: JSON.stringify(reportData),
        sourceFiles: JSON.stringify(
          _.map(_.zipObject(sourceFileNames, sourceFileContents), (v, k) => {
            return {
              contents: v,
              hash: md5(k)
            };
          })
        )
      }));
    })
    .catch(err => {
      console.error(err.stack);
      process.exit(1);
    });
  });
}
