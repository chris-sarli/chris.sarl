const MAX_TIME = 60;
const MAX_COST = 18;
let margin = {
  "left": 50,
  "right": 20,
  "bottom": 50,
  "top": 10,
}
let width = (document.getElementById("prices").offsetWidth - margin.left - margin.right)
let height = 300

let xRange = [...Array(MAX_TIME + 1).keys()]

price_schemes = [
  {
    "id": 0,
    "label": "JUMP (Original)",
    "selected": true,
    "color": "#FF0000",
    "fn": (x => 2.0 + (0.07 * Math.max(x - 30, 0)))
  },
  {
    "id": 1,
    "label": "JUMP (&ldquo;Free to Unlock&rdquo;)",
    "selected": true,
    "color": "#FF0000",
    "fn": (x => x * 0.3),
    "dashing": [8, 6],
    "legend_style": "dashed"
  },
  {
    "id": 2,
    "label": "JUMP (Compromise)",
    "selected": true,
    "color": "#FF0000",
    "fn": (x => 3.0 + (0.15 * Math.max(x - 20, 0))),
    "dashing": [4, 4],
    "legend_style": "dotted"
  },
  {
    "id": 3,
    "label": "Spin",
    "selected": true,
    "color": "orange",
    "fn": (x => 1.0 + (0.29 * x))
  },
  {
    "id": 4,
    "label": "Blue Bikes",
    "selected": false,
    "color": "#51a2dc",
    "fn": (x => Math.max(Math.ceil((x) / 30.0), 1) * 2.95)
  },
  {
    "id": 5,
    "label": "CitiBike",
    "selected": false,
    "color": "#1d44a9",
    "fn": (x => 3.5 + (0.18 * Math.max(x - 30, 0)))
  },
  {
    "id": 6,
    "label": "CitiBike (Electric)",
    "selected": false,
    "color": "#1d44a9",
    "fn": (x => 3.5 + (0.18 * x)),
    "dashing": [8, 6],
    "legend_style": "dashed"
  },
  {
    "id": 7,
    "label": "Capital Bikeshare",
    "selected": false,
    "color": "#f8dc4a",
    "fn": (x => x <= 30 ? 2.0 : 4.0)
  },
  {
    "id": 8,
    "label": "Capital Bikeshare (Electric)",
    "selected": false,
    "color": "#f8dc4a",
    "fn": (x => x <= 30 ? 3.0 : 5.0)
  },
  {
    "id": 9,
    "label": "Bike Chattanooga",
    "selected": false,
    "color": "#a6ce6a",
    "fn": (x => 8.0)
  },
  {
    "id": 10,
    "label": "Bay Wheels",
    "selected": false,
    "color": "#ea39ba",
    "fn": (x => 3.0 + Math.ceil(Math.max(x-30, 0) / 15) * 3)
  },
  {
    "id": 11,
    "label": "Bay Wheels (Electric)",
    "selected": false,
    "color": "#ea39ba",
    "fn": (x => 3.0 + (Math.ceil(Math.max(x-30, 0) / 15) * 6) + (Math.min(x, 30) * 0.2)),
    "dashing": [8, 6],
    "legend_style": "dashed"
  },
  {
    "id": 12,
    "label": "Divvy",
    "selected": false,
    "color": "#b6d7f4",
    "fn": (x => 3.3 + (0.15 * Math.max(0, x - 30)))
  },
  {
    "id": 13,
    "label": "Divvy (Electric)",
    "selected": false,
    "color": "#b6d7f4",
    "fn": (x => 3.3 + (0.2 * x)),
    "dashing": [8, 6],
    "legend_style": "dashed"
  },
]


svg = d3.select("#prices")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
"translate(" + margin.left + "," + margin.top + ")")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 " + width + " " + height);

;

x = d3.scaleLinear().range([0, width]);

xAxis = svg.append("g")
.attr("transform", `translate(0,` + (height) + ")")
.call(d3.axisBottom(x).tickFormat(d3.format(".0f")));

svg.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
.style("text-anchor", "middle")
.attr("fill", "black")
.text("Ride Duration (minutes)");

svg.append("text")
.attr("transform", `translate(${-30}, ${height / 2})rotate(-90)`)
.style("text-anchor", "middle")
.style("width", 20)
.attr("fill", "black")
.text("Total Cost ($)");

y = d3.scaleLinear()
.range([height, 0]);

yAxis = svg.append("g")
.call(d3.axisLeft(y));

x.domain([0, MAX_TIME]);
y.domain([0, MAX_COST]);

xAxis.call(d3.axisBottom(x))
yAxis.call(d3.axisLeft(y))

var legend = d3.select("#legend_container")

price_schemes.forEach(scheme => {
  legend.append("label").attr('for', 's' + scheme['id']).html(`<span class="legend_item"><input type='checkbox' id='s${scheme['id']}' value='${scheme['id']}'${scheme['selected'] ? ' checked' : ''}><div class="legend_line" style="border-top-color: ${scheme['color']}; border-top-style: ${scheme["legend_style"] || "solid"}"></div><span class='legend_text'>${scheme['label']}</span></span>`)
})

d3.selectAll("input").on("change", function(d) {
  price_schemes[this.value]['selected'] = this.checked;
  update_chart();
});

function update_chart() {
  svg.selectAll("path").remove()
  price_schemes.filter(scheme => scheme.selected).forEach(scheme => {
    svg.append("path")
    .datum(xRange)
    .attr("fill", "none")
    .attr("stroke", scheme["color"])
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", scheme["dashing"] || "0, 0")
    .attr('d', d3.line()
      .x(d => {return x(d)})
      .y(d => y(scheme['fn'](d)))
    )
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);
  })
  xAxis = svg.append("g")
  .attr("transform", `translate(0,` + (height) + ")")
  .call(d3.axisBottom(x).tickFormat(d3.format(".0f")));
  yAxis = svg.append("g")
  .call(d3.axisLeft(y));

  svg.selectAll("rect").remove()

  focus = svg
  .append('g')
  .append('rect')
    .style("fill", "black")
    .attr('width', 1)
    .attr('height', height)
    .style("opacity", 1)

    svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);


}

update_chart();

// Create the circle that travels along the curve of chart
var focus = svg
  .append('g')
  .append('rect')
    .style("fill", "black")
    .attr('width', 1)
    .attr('height', height)
    .style("opacity", 1)

// Adapted from D3 Graphs website
var tooltip = d3.select("#prices")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .attr("id", "tooltip");

svg
.append('rect')
.style("fill", "none")
.style("pointer-events", "all")
.attr('width', width)
.attr('height', height)
.on('mouseover', mouseover)
.on('mousemove', mousemove)
.on('mouseout', mouseout);

// What happens when the mouse move -> show the annotations at the right positions.
function mouseover() {
  focus.style("opacity", 1)
  tooltip.style("opacity",1)
}

function mousemove() {
  // recover coordinate we need
  var x0 = x.invert(d3.mouse(this)[0]);
  let rounded = Math.round(x0)
  let html = `<h3>${rounded} Minute Ride</h3><table>`
  price_schemes.filter(scheme => scheme.selected).map(scheme => [scheme['label'], scheme['fn'](rounded)]).sort((a, b) => b[1] - a[1]).forEach(scheme => {
    html += "<tr><td>" + scheme[0] + "</td><td>$" + scheme[1].toFixed(2) + "</td></tr>"
  })
  html += "</html>"
  var x0 = x.invert(d3.mouse(this)[0]);
  focus
    .attr("x", x(x0))
  tooltip
    .html(html)
    .style("top", `${d3.event.pageY - document.getElementById("tooltip").offsetHeight -18}px`);

  if (x0 <= 30) {
    tooltip.style("margin-left", x(x0)+margin.left+3 + "px")
  } else {
    tooltip.style("margin-left", x(x0)+margin.left-document.getElementById("tooltip").offsetWidth+-3 + "px")
  }
  }

function mouseout() {
  focus.style("opacity", 0)
  tooltip.style("opacity", 0)
}
