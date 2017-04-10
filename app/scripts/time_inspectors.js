$.get('http://localhost:4040/api/scanners/monthData', function (data) {
  console.log(data);

  /*
   {
   '_id': '58e22490cefc9665e4354cde',
   'hostname': 'repairnator',
   'dateBegin': '2017-04-03T12:00:00.000Z',
   'dateLimit': '2017-04-03T08:00:00.000Z',
   'dayLimit': '03/04/2017',
   'totalRepoNumber': 1611,
   'totalRepoUsingTravis': 1601,
   'totalScannedBuilds': 205,
   'totalJavaBuilds': 198,
   'totalJavaPassingBuilds': 152,
   'totalJavaFailingBuilds': 27,
   'totalJavaFailingBuildsWithFailingTests': 8,
   'totalPRBuilds': 52,
   'duration': '0:31:4',
   'runId': '92d87100-e392-4b7c-8f49-2789af76ef7c',
   'dateBeginStr': '03/04/17 12:00',
   'dateLimitStr': '03/04/17 08:00'
   },
   */


  var svg = d3.select('#charts').append('svg')
      .attr('width', 800)
      .attr('height', 600),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr('width') - margin.left - margin.right,
    height = svg.attr('height') - margin.top - margin.bottom,
    g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var parseTime = d3.isoParse;

  var scannerData = [
    {
      id: 'totalScannedBuilds',
      values: data.map( function (d) {
        return {
          date: parseTime(d.dateBegin),
          number: d.totalScannedBuilds
        }
      })
    },
    {
      id: 'totalJavaBuilds',
      values: data.map( function (d) {
        return {
          date: parseTime(d.dateBegin),
          number: d.totalJavaBuilds
        }
      })
    },
    {
      id: 'totalJavaPassingBuilds',
      values: data.map( function (d) {
        return {
          date: parseTime(d.dateBegin),
          number: d.totalJavaPassingBuilds
        }
      })
    },
    {
      id: 'totalJavaFailingBuilds',
      values: data.map( function (d) {
        return {
          date: parseTime(d.dateBegin),
          number: d.totalJavaFailingBuilds
        }
      })
    },
    {
      id: 'totalJavaFailingBuildsWithFailingTests',
      values: data.map( function (d) {
        return {
          date: parseTime(d.dateBegin),
          number: d.totalJavaFailingBuildsWithFailingTests
        }
      })
    }
  ];

  var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

  x.domain(d3.extent(data, function(d) { return parseTime(d.dateBegin); }));

  y.domain([
    d3.min(scannerData, function (s) { return d3.min(s.values, function(d) { return d.number; }) }),
    d3.max(scannerData, function (s) { return d3.max(s.values, function(d) { return d.number; }) }),
  ]);

  z.domain(scannerData.map(function(c) { return c.id; }));

  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('fill', '#000')
    .text('Travis Build Number');

  var line = d3.line()
    .curve(d3.curveLinear)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.number); });

  var allData = g.selectAll('.scanner')
    .data(scannerData)
    .enter().append('g')
    .attr('class', 'scanner');

  allData.append('path')
    .attr('class', 'line')
    .attr('d', function(d) { return line(d.values); })
    .style('stroke', function(d) { return z(d.id); });

  allData.append('text')
    .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
    .attr('transform', function(d) { return 'translate(' + x(d.value.date) + ',' + y(d.value.number) + ')'; })
    .attr('x', 3)
    .attr('dy', '0.35em')
    .style('font', '10px sans-serif')
    .text(function(d) { return d.id; });
});
