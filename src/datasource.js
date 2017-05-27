import _ from "lodash";

export class TimelionDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.instanceSettings = instanceSettings;
    this.esVersion = this.instanceSettings.esVersion  || "5.3.0"
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
  }

  request(options){
    options.headers = {
      "kbn-version": this.esVersion,
      "Content-Type": "application/json;charset=UTF-8"
    };
    return this.backendSrv.datasourceRequest(options);
  }

  query(options) {
    console.log(options);
    var query = this.buildQueryParameters(options);
    
    if (query.targets.length <= 0) {
      return this.q.when({data: []});
    }
    return this.request({
        url: this.url + '/run',
        data: options.query,
        method: 'POST'
      }).then(result => result.data.sheet["0"].list
            .map((data,ix) => ({
              "target": query.targets[ix].refId,
              "datapoints": data.map(d => [d[1],d[2]])
            })));
  }

  testDatasource() {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/run',
      method: 'GET'
    }).then(response => {
      if (response.status === 400) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }

  annotationQuery(options) {
    var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
    var annotationQuery = {
      range: options.range,
      annotation: {
        name: options.annotation.name,
        datasource: options.annotation.datasource,
        enable: options.annotation.enable,
        iconColor: options.annotation.iconColor,
        query: query
      },
      rangeRaw: options.rangeRaw
    };

    return this.backendSrv.datasourceRequest({
      url: this.url + '/annotations',
      method: 'POST',
      data: annotationQuery
    }).then(result => {
      return result.data;
    });
  }

  metricFindQuery(query) {
    var interpolated = {
      target: this.templateSrv.replace(query, null, 'regex')
    };

    return this.backendSrv.datasourceRequest({
      url: this.url + '/search',
      data: interpolated,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(this.mapToTextValue);
  }

  mapToTextValue(result) {
    return _.map(result.data, (d, i) => {
      if (d && d.text && d.value) {
        return { text: d.text, value: d.value };
      } else if (_.isObject(d)) {
        return { text: d, value: i};
      }
      return { text: d, value: d };
    });
  }

  buildQueryParameters(options) {
    const queryTpl = {"sheet":null,
                      "time":{
                        "from": options.range.from.format("YYYY-MM-DDTHH:mm:ss ZZ"),
                        "interval":"auto",
                        "mode":"absolute",
                        "timezone":"GMT",
                        "to": options.range.from.format("YYYY-MM-DDTHH:mm:ss ZZ")
                      }
                    };
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric' && !target.hide;
    });

    queryTpl.sheets = _.map(options.targets, target => this.templateSrv.replace(target.target));
    options.query = JSON.stringify(queryTpl);
    return options;
  }
}
