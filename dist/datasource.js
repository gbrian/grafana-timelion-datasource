"use strict";

System.register(["lodash"], function (_export, _context) {
  "use strict";

  var _, _createClass, TimelionDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export("TimelionDatasource", TimelionDatasource = function () {
        function TimelionDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, TimelionDatasource);

          this.instanceSettings = instanceSettings;
          this.esVersion = this.instanceSettings.esVersion || "5.3.0";
          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
        }

        _createClass(TimelionDatasource, [{
          key: "request",
          value: function request(options) {
            options.headers = {
              "kbn-version": this.esVersion,
              "Content-Type": "application/json;charset=UTF-8"
            };
            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: "query",
          value: function query(options) {
            var query = this.buildQueryParameters(options);
            var oThis = this;
            if (query.targets.length <= 0) {
              return this.q.when({ data: [] });
            }
            return this.request({
              url: this.url + '/run',
              data: options.query,
              method: 'POST'
            }).then(function (response) {
              return { "data": response.data.sheet["0"].list.map(function (list, ix) {
                  return {
                    "target": list.label,
                    "datapoints": _.map(list.data, function (d) {
                      return [d[1], d[0]];
                    })
                  };
                }) };
            });
          }
        }, {
          key: "testDatasource",
          value: function testDatasource() {
            return this.backendSrv.datasourceRequest({
              url: this.url + '/run',
              method: 'GET'
            }).then(function (response) {
              if (response.status === 400) {
                return { status: "success", message: "Data source is working", title: "Success" };
              }
            });
          }
        }, {
          key: "annotationQuery",
          value: function annotationQuery(options) {
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
            }).then(function (result) {
              return result.data;
            });
          }
        }, {
          key: "metricFindQuery",
          value: function metricFindQuery(query) {
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
        }, {
          key: "mapToTextValue",
          value: function mapToTextValue(result) {
            return _.map(result.data, function (d, i) {
              if (d && d.text && d.value) {
                return { text: d.text, value: d.value };
              } else if (_.isObject(d)) {
                return { text: d, value: i };
              }
              return { text: d, value: d };
            });
          }
        }, {
          key: "buildQueryParameters",
          value: function buildQueryParameters(options) {
            var _this = this;

            var queryTpl = { "sheet": null,
              "time": {
                "from": options.range.from.format("YYYY-MM-DDTHH:mm:ss ZZ"),
                "interval": "auto",
                "mode": "absolute",
                "timezone": "GMT",
                "to": options.range.to.format("YYYY-MM-DDTHH:mm:ss ZZ")
              }
            };
            //remove placeholder targets
            options.targets = _.filter(options.targets, function (target) {
              return target.target !== 'select metric' && !target.hide;
            });

            queryTpl.sheet = _.map(options.targets, function (target) {
              return _this.templateSrv.replace(target.target).replace(/\r\n|\r|\n/mg, "");
            });
            options.query = JSON.stringify(queryTpl);
            return options;
          }
        }]);

        return TimelionDatasource;
      }());

      _export("TimelionDatasource", TimelionDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
