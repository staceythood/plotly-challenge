function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {
    let panel = d3.select("#sample-metadata");

    console.log(response);
    let metadata = response;
    panel.selectAll("ul").remove();
    let ul = panel.append("ul");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      var cell = ul.append("li").classed("list-style-type:none");
      cell.text(`${key}: ${value}`);
    });

    // panel.on("#sample-metadata", function() {
    //   var newEntry = d3.event.target.value;
    //   console.log(newEntry);
    // });
  });

  // BONUS: Build the Gauge Chart
  url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {
    console.log(response);
    let metagauge = response;

    var datagauge = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: sample.WFREQ,
        title: { text: "Belly Button Washes per Week" },
        type: "indicator",
        mode: "gauge+number",
        autosize: true,
        gauge: {
          axis: { range: [0, 10] },
          steps: [
            { range: [0, 2], color: "#ffe6f2" },
            { range: [2, 4], color: "#ffcce6" },
            { range: [4, 6], color: "#ffb3d9" },
            { range: [6, 8], color: "#ff99cc" },
            { range: [8, 10], color: "#ff80bf" }
          ]
        }
      }
    ];

    var layout3 = { width: 600, height: 450, margin: { t: 0, b: 0 } };

    Plotly.newPlot("gauge", datagauge, layout3);
  });
}
let gaugeChart = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: sample.WFREQ,
    title: { text: "Belly Button Washes per Week" },
    type: "indicator",
    mode: "gauge+number",
    autosize: true,
    gauge: {
      axis: { range: [0, 10] },
      steps: [
        { range: [0, 2], color: "#fff2cc" },
        { range: [2, 4], color: "#ffdf80" },
        { range: [4, 6], color: "#ffcc33" },
        { range: [6, 8], color: "#e6ac00" },
        { range: [8, 10], color: "#997300" }
      ],
      bar: { color: "#88cc00" }
    }
  }
];
function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url2 = `/samples/${sample}`;
  d3.json(url2).then(function(response) {
    console.log(response);
    var sampledata = response;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sampledata.otu_ids,
      y: sampledata.sample_values,
      text: sampledata.otu_labels,
      mode: "markers",
      marker: {
        color: sampledata.otu_ids,
        size: sampledata.sample_values
      }
    };

    var data = [trace1];

    var layout = {
      showlegend: false,
      height: 600,
      width: 1200,
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      }
    };

    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    const tenSamples = sampledata.sample_values.slice(0, 9);
    const tenIds = sampledata.otu_ids.slice(0, 9);
    const tenLabels = sampledata.otu_labels.slice(0, 9);

    var trace2 = {
      values: tenSamples,
      labels: tenIds,
      type: "pie"
    };
    var data2 = [trace2];

    var layout2 = {
      height: 400,
      width: 400,
      hoverinfo: tenLabels,
      textinfo: "none"
    };

    Plotly.newPlot("pie", data2, layout2);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach(sample => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(firstSample);
}

// Initialize the dashboard
init();
