import _ from "lodash";

export class TimelionDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv, timeSrv) {
    this.instanceSettings = instanceSettings;
    this.esVersion = this.instanceSettings.esVersion || "5.3.0"
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.timeSrv = timeSrv;
  }

  request(options) {
    options.headers = {
      "kbn-version": this.esVersion,
      "Content-Type": "application/json;charset=UTF-8"
    };
    return this.backendSrv.datasourceRequest(options);
  }

  query(options) {
    var query = this.buildQueryParameters(options);
    var oThis = this;
    if (query.targets.length <= 0) {
      return this.q.when({ data: [] });
    }
    var reqs = _.map(options.queries,
      query => oThis.request({
        url: this.url + '/run',
        data: query,
        method: 'POST'
      })
        .then(response => oThis.readTimlionSeries(response)
          .map((list, ix) => ({
            "target": list.label,
            "datapoints": _.map(list.data, d => [d[1], d[0]])
          }))));
    return this.q.all(reqs).then(series => ({ "data": _.flatten(series) }))
  }

  readTimlionSeries(response) {
    return _.flatten(_.map(response.data.sheet, sheet => sheet.list));
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
      target: this.templateSrv.replace(query, null, 'lucene')
    };
    return this["query"]({
        targets:[interpolated],
        range:this.timeSrv.timeRange(),
        scopedVars:{}})
        .then(series => {
          return _.map(series.data, d => ({text:d.target}));
        });
  }

  mapToTextValue(result) {
    return _.map(result.data, (d, i) => {
      if (d && d.text && d.value) {
        return { text: d.text, value: d.value };
      } else if (_.isObject(d)) {
        return { text: d, value: i };
      }
      return { text: d, value: d };
    });
  }

  buildQueryParameters(options) {
    var oThis = this;
    //remove placeholder targets
    options.targets = _.filter(options.targets, target => {
      return target.target !== 'select metric' && !target.hide;
    });

    const queryTpl = {
      "sheet": null,
      "time": {
        "from": options.range.from.format("YYYY-MM-DDTHH:mm:ss ZZ"),
        "interval": "auto",
        "mode": "absolute",
        "timezone": "GMT",
        "to": options.range.to.format("YYYY-MM-DDTHH:mm:ss ZZ")
      }
    };
    var expandTemplate = function(target){
      _.map(Object.keys(options.scopedVars), key =>
                   target = target.replace("$"+key, options.scopedVars[key].value));
      return oThis.templateSrv
            .replace(target, true)
            .replace(/\r\n|\r|\n/mg, "")
            .trim();
    };
    var targets = _.map(options.targets, target => {
      var target = expandTemplate(target.target);
      var scale_interval = /.scale_interval\(([^\)]*)\)/.exec(target);
      var interval = target.interval || undefined;
      if (scale_interval) {
        interval = scale_interval[1];
        target = target.replace(scale_interval[0], "");
      }
      return { target: target, interval: interval };
    });
    var variables = _.filter(_.map(options.targets, t => expandTemplate(t.target)),
                                  t => t.indexOf("$") == 0)
                      .join(",");
    var intervalGroups = _.groupBy(targets, t => t.interval);
    var intervals = Object.keys(intervalGroups);
    var queries = _.map(intervals, key => ({
      interval: key,
      sheet: _.map(intervalGroups[key], target => (variables && variables.length) ?
                                                            [variables, target.target].join(","):
                                                            target.target)
    }));
    options.queries = _.map(queries, q => {
      queryTpl.sheet = q.sheet;
      queryTpl.time.interval = !q.interval || q.interval === 'undefined' ? 'auto' : q.interval;
      return _.cloneDeep(queryTpl);
    });
    return options;
  }
}
