'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var TimelionDatasource, TimelionDatasourceQueryCtrl, TimelionConfigCtrl, GenericQueryOptionsCtrl, GenericAnnotationsQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      TimelionDatasource = _datasource.TimelionDatasource;
    }, function (_query_ctrl) {
      TimelionDatasourceQueryCtrl = _query_ctrl.TimelionDatasourceQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', TimelionConfigCtrl = function TimelionConfigCtrl() {
        _classCallCheck(this, TimelionConfigCtrl);
      });

      TimelionConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', GenericQueryOptionsCtrl = function GenericQueryOptionsCtrl() {
        _classCallCheck(this, GenericQueryOptionsCtrl);
      });

      GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('AnnotationsQueryCtrl', GenericAnnotationsQueryCtrl = function GenericAnnotationsQueryCtrl() {
        _classCallCheck(this, GenericAnnotationsQueryCtrl);
      });

      GenericAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

      _export('Datasource', TimelionDatasource);

      _export('QueryCtrl', TimelionDatasourceQueryCtrl);

      _export('ConfigCtrl', TimelionConfigCtrl);

      _export('QueryOptionsCtrl', GenericQueryOptionsCtrl);

      _export('AnnotationsQueryCtrl', GenericAnnotationsQueryCtrl);
    }
  };
});
