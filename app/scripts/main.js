$.get('http://localhost:4040/api/inspectors/hostnameStats', function (data) {
  console.log(data);
  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;
  var donutWidth = 75;
  var legendRectSize = 18;
  var legendSpacing = 4;


  var color = d3.scale.ordinal()
    .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

  var arc = d3.svg.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.counted; });

  var svg = d3.select('#charts').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
      ',' + (height / 2) + ')');

  /*var g = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc');

  g.append('path')
    .attr('d', arc)
    .style('fill', function(d) { return color(d.data._id); });*/

  var path = svg.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return color(d.data._id);
    });

  var tooltip = d3.select('#charts')                               // NEW
    .append('div')                                                // NEW
    .attr('class', 'tooltip');                                    // NEW

  tooltip.append('div')                                           // NEW
    .attr('class', 'label');                                      // NEW

  tooltip.append('div')                                           // NEW
    .attr('class', 'count');                                      // NEW

  tooltip.append('div')                                           // NEW
    .attr('class', 'percent');                                    // NEW

  path.on('mouseover', function(d) {                            // NEW
    var total = d3.sum(data.map(function(d) {                // NEW
      return d.counted;                                           // NEW
    }));                                                        // NEW
    var percent = Math.round(1000 * d.data.counted / total) / 10; // NEW
    tooltip.select('.label').html(d.data._id);                // NEW
    tooltip.select('.count').html(d.data.counted);                // NEW
    tooltip.select('.percent').html(percent + '%');             // NEW
    tooltip.style('display', 'block');                          // NEW
  });                                                           // NEW

  path.on('mouseout', function() {                              // NEW
    tooltip.style('display', 'none');                           // NEW
  });                                                           // NEW

  path.on('mousemove', function(d) {                            // NEW
   tooltip.style('top', (d3.event.pageY + 10) + 'px')          // NEW
   .style('left', (d3.event.pageX + 10) + 'px');             // NEW
   });                                                           // NEW

  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = -2 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });

  /*g.append('text')
    .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
    .attr('dy', '.35em')
    .text(function(d) { return d.data._id; });*/


});
