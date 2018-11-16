import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class TimelionDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, uiSegmentSrv)  {
    super($scope, $injector);

    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;
    this.target.target = this.target.target || '.es(*)';
    this.target.type = this.target.type || 'timeserie';
    this.target.interval = this.target.interval || undefined;
    if(this.target.rawQuery === undefined)
      this.target.rawQuery = true;
  }

  getOptions(query) {
    // Options have to be transformed by uiSegmentSrv to be usable by metric-segment-model directive
    return this.datasource.metricFindQuery(query || '')
      .then(this.uiSegmentSrv.transformToSegments(false));
  }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}

TimelionDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

