# grafana-timelion-datasource
ELK Timelion's data source for Grafana 

## Setup

Set the url for your ES server like: http://server:posrt/api/timelion

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

**have fun!**
