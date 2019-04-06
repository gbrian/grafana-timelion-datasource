[![repofunding](https://img.shields.io/badge/powered%20by-repofunding-green.svg)](https://github.com/gbrian/repofunding) [![](https://img.shields.io/badge/support-5€-lightgray.svg)](https://www.paypal.me/repofunding/5)

# grafana-timelion-datasource ![version](https://img.shields.io/badge/version-1.0.1-blue.svg)

ELK Timelion's data source for Grafana

![logo](https://raw.githubusercontent.com/gbrian/grafana-timelion-datasource/master/doc/logo.PNG)

## Setup

Set the url for your ES server like: http://server:port/api/timelion (Same server where your Kibana instance is running)

## Features

### Query

Only query datasource feature is implemented.
Multiple queries can be specified using same metric like: `.es(*).label(metric1),.es(q=*,offset=1d).label(metric2)`
Or defining multiple metrics.

Refer to Timelion's documentation for more details on writing queries: https://github.com/elastic/timelion/blob/master/FUNCTIONS.md

### Labeling

Use the `label()` function to set the name of the metric

### Interval

Use the `scale_interval()` function to specify metric interval. Grafana templating values are allowed

### Variables

Starting with version 1.0.1 you can retrieve variables from Timelion labels.

![labels](https://raw.githubusercontent.com/gbrian/grafana-timelion-datasource/master/doc/variables_1.PNG)

### Annotations

You can query annotations using Timelion as follow:

![Annotations](https://raw.githubusercontent.com/gbrian/grafana-timelion-datasource/master/src/img/annotations.png)

Notes:

- Data will be returned as `<label>: <value>` example `q* > host > count: 10`
- Define a regexp to split label and use capture groups for: title, description, tags
- Timelion always returns a data point for each tick in the time range. Use `Ignore value` to discard invalid values. Default value is 0.

### Screenshot

![labels](https://raw.githubusercontent.com/gbrian/grafana-timelion-datasource/master/doc/preview_ver1.png)

**have fun!**

## Thanks to

Grafana team and [@bergquist](https://github.com/bergquist)

## **Fueled by [@repofunding](https://github.com/gbrian/repofunding)![repofunding logo](https://raw.githubusercontent.com/gbrian/grafana-timelion-datasource/master/doc/repofunding_logo.png)**
