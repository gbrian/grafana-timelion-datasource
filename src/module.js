import {TimelionDatasource} from './datasource';
import {TimelionDatasourceQueryCtrl} from './query_ctrl';

class TimelionConfigCtrl {
  constructor($scope, datasourceSrv) {
    this.datasourceSrv = datasourceSrv;
    this.current.jsonData = this.current.jsonData || {};
    this.current.jsonData.esVersion = this.current.jsonData.esVersion || '5.3.0';
  }
}
TimelionConfigCtrl.templateUrl = 'partials/config.html';

class GenericQueryOptionsCtrl {}
GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

class GenericAnnotationsQueryCtrl {}
GenericAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html'

export {
  TimelionDatasource as Datasource,
  TimelionDatasourceQueryCtrl as QueryCtrl,
  TimelionConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
  GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
