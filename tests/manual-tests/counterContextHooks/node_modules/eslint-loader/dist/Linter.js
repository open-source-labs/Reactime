"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _process = _interopRequireDefault(require("process"));

var _path = require("path");

var _fsExtra = require("fs-extra");

var _loaderUtils = require("loader-utils");

var _ESLintError = _interopRequireDefault(require("./ESLintError"));

var _createEngine = _interopRequireDefault(require("./createEngine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Linter {
  constructor(loaderContext, options) {
    this.loaderContext = loaderContext;
    this.options = options;
    this.resourcePath = this.parseResourcePath();
    const {
      CLIEngine,
      engine
    } = (0, _createEngine.default)(options);
    this.CLIEngine = CLIEngine;
    this.engine = engine;
  }

  parseResourcePath() {
    const cwd = _process.default.cwd();

    let {
      resourcePath
    } = this.loaderContext; // remove cwd from resource path in case webpack has been started from project
    // root, to allow having relative paths in .eslintignore
    // istanbul ignore next

    if (resourcePath.indexOf(cwd) === 0) {
      resourcePath = resourcePath.substr(cwd.length + (cwd === '/' ? 0 : 1));
    }

    return resourcePath;
  }

  lint(content) {
    try {
      return this.engine.executeOnText(content, this.resourcePath, true);
    } catch (_) {
      this.getEmitter(false)(_);
      return {
        src: content
      };
    }
  }

  printOutput(data) {
    const {
      options
    } = this; // skip ignored file warning

    if (this.constructor.skipIgnoredFileWarning(data)) {
      return;
    } // quiet filter done now
    // eslint allow rules to be specified in the input between comments
    // so we can found warnings defined in the input itself


    const res = this.filter(data); // if enabled, use eslint auto-fixing where possible

    if (options.fix) {
      this.autoFix(res);
    } // skip if no errors or warnings


    if (res.errorCount < 1 && res.warningCount < 1) {
      return;
    }

    const results = this.parseResults(res); // Do not analyze if there are no results or eslint config

    if (!results) {
      return;
    }

    const messages = options.formatter(results);
    this.reportOutput(results, messages);
    this.failOnErrorOrWarning(res, messages);
    const emitter = this.getEmitter(res);
    emitter(new _ESLintError.default(messages));
  }

  static skipIgnoredFileWarning(res) {
    return res && res.warningCount === 1 && res.results && res.results[0] && res.results[0].messages[0] && res.results[0].messages[0].message && res.results[0].messages[0].message.indexOf('ignore') > 1;
  }

  filter(data) {
    const res = data; // quiet filter done now
    // eslint allow rules to be specified in the input between comments
    // so we can found warnings defined in the input itself

    if (this.options.quiet && res && res.warningCount && res.results && res.results[0]) {
      res.warningCount = 0;
      res.results[0].warningCount = 0;
      res.results[0].messages = res.results[0].messages.filter(message => message.severity !== 1);
    }

    return res;
  }

  autoFix(res) {
    if (res && res.results && res.results[0] && (res.results[0].output !== res.src || res.results[0].fixableErrorCount > 0 || res.results[0].fixableWarningCount > 0)) {
      this.CLIEngine.outputFixes(res);
    }
  }

  parseResults({
    results
  }) {
    // add filename for each results so formatter can have relevant filename
    if (results) {
      results.forEach(r => {
        // eslint-disable-next-line no-param-reassign
        r.filePath = this.loaderContext.resourcePath;
      });
    }

    return results;
  }

  reportOutput(results, messages) {
    const {
      outputReport
    } = this.options;

    if (!outputReport || !outputReport.filePath) {
      return;
    }

    let content = messages; // if a different formatter is passed in as an option use that

    if (outputReport.formatter) {
      content = outputReport.formatter(results);
    }

    let filePath = (0, _loaderUtils.interpolateName)(this.loaderContext, outputReport.filePath, {
      content
    });

    if (!(0, _path.isAbsolute)(filePath)) {
      filePath = (0, _path.join)( // eslint-disable-next-line no-underscore-dangle
      this.loaderContext._compiler.options.output.path, filePath);
    }

    (0, _fsExtra.ensureFileSync)(filePath);
    (0, _fsExtra.writeFileSync)(filePath, content);
  }

  failOnErrorOrWarning({
    errorCount,
    warningCount
  }, messages) {
    const {
      failOnError,
      failOnWarning
    } = this.options;

    if (failOnError && errorCount) {
      throw new _ESLintError.default(`Module failed because of a eslint error.\n${messages}`);
    }

    if (failOnWarning && warningCount) {
      throw new _ESLintError.default(`Module failed because of a eslint warning.\n${messages}`);
    }
  }

  getEmitter({
    errorCount
  }) {
    const {
      options,
      loaderContext
    } = this; // default behavior: emit error only if we have errors

    let emitter = errorCount ? loaderContext.emitError : loaderContext.emitWarning; // force emitError or emitWarning if user want this

    if (options.emitError) {
      emitter = loaderContext.emitError;
    } else if (options.emitWarning) {
      emitter = loaderContext.emitWarning;
    }

    return emitter;
  }

}

exports.default = Linter;