[![repofunding](https://img.shields.io/badge/powered%20by-repofunding-green.svg)](https://github.com/gbrian/repofunding) [![](https://img.shields.io/badge/support-5€-lightgray.svg)](https://www.paypal.me/repofunding/5) 

# grafana-timelion-datasource ![version](https://img.shields.io/badge/version-1.0.1-blue.svg)
ELK Timelion's data source for Grafana 

![logo](doc/logo.PNG)

## Setup

Set the url for your ES server like: http://server:port/api/timelion (Same server where your Kibana instance is running)

## Features
### Query

Only query datasource feature is implemented.
Multiple queires can be spceified using same metric like: `.es(*).label(metric1),.es(q=*,offset=1d).label(metric2)`
Or defining multiple metrics.

Refer to Timelion's documentation for more details on writting queries: https://github.com/elastic/timelion/blob/master/FUNCTIONS.md


### Labeling

Use the `label()` function to set the name of the metric

### Interval

Use the `scale_interval()` function to specify metric interval. Grafana templating values are allowed

### Variables
Starting with version 1.0.1 you can retrieve variables from Timelion labels.

![labels](doc/variables_1.PNG)

### Screenshot
![labels](doc/preview_ver1.png)

**have fun!**

## Thanks to
Grafana team and [@bergquist](https://github.com/bergquist)

## *Fueled by <a href="https://github.com/gbrian/repofunding">@repofunding*<img src="https://avatars1.githubusercontent.com/u/38230168?s=460&v=4" width="32" height="32"/></a>
