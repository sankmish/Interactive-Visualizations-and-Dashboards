function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`

  // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);



  var url = `/metadata/${sample}`;
  console.log(`${sample}`);
console.log(url);

  d3.json(url).then(function(response) {
    var data = response;
    console.log(data);
    var sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");
  
    Object.entries(data).forEach(function([key, value]){
      var instance = sampleMetadata.append("p");
        instance.text(key + ": " + value);

    });
      
  });

}





function buildCharts(sample) {

  var url = `/samples/${sample}`;
  console.log(url);


  d3.json(url).then(function(response) {
    var data = response;
    console.log("data " + data.otu_ids);
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      marker: {
        size : data.sample_values,
        color: data.otu_ids
      },
      text: data.otu_labels
    }

    var layout = {
      xaxis: { 
        range: [0, 3500],
        title: "OTU ID"
      },
      yaxis: { 
        range: [0, 250],
        title: "Sample Values"
        },
      title: 'OTU ID Vs. Sample Values'
    }

    Plotly.newPlot("bubble", [trace1], layout);



    var pieChartColors = ['rgb(0, 57, 230)', 'rgb(255, 102, 0)', 'rgb(0, 179, 60)', 'rgb(153, 0, 0)', 'rgb(102, 102, 255)', 'rgb(116, 37, 77)',
                   'rgb(204, 102, 255)', 'rgb(102, 102, 153)', 'rgb(153, 153, 77)', 'rgb(102, 204, 255)' ]

    var trace2 = {
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hoverinfo: data.otu_labels.slice(0,10),
      type: 'pie',
      marker: {
        colors: pieChartColors
      }
    };

    var layout2 = {
      title: 'OTU ID Vs. Sample Values'
    }

    Plotly.newPlot("pie", [trace2], layout2);
  });

}
  


function init() {
  var selector = d3.select("#selDataset");
  
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

