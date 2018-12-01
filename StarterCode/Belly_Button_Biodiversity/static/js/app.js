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



  // Why aren't my console statements showing?  
  var url = "/metadata/" + sample;
  console.log(url);

  d3.json(url).then(function(response) {
  console.log(response);
    var data = [response];
    var sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");
  
    Object.entries(data).forEach(function([key, value]){
      var instance = sampleMetadata.append("p");
        instance.text(key + ": " + value);

        //Is this the correct object.entries call on data for a single dictionary with multiple key value pairs?
    });
      
  });

  //Is this code segment wrong? Nnot sure why it is not working. 

}





function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  var url = "/samples/" + sample;
  console.log(url);


  d3.json(url).then(function(response) {

    console.log(response);
    var data = [response];
    console.log(data);

    //Is this the right way to call the elements in the data? data.otu_ids, response.otu_ids, or list comprehension?
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      type: "scatter", 
      marker: {size : data.sample_values},
      color: data.otu_ids,
      text: data.otu_labels
    }

    var layout = {
      xaxis: { range: [0, 3500] },
      yaxis: { range: [0, 250]  },
      title: 'OTU ID Vs. Sample Values'
    }

    //How do I get the plot to place in this div ^-
    Plotly.newPlot("bubble", data, layout);


    //If you sort this will the other values move with it?
    data.sample_values.sort(function compareFunction(firstNum, secondNum){
      return secondNum - firstNum;
    });

    data.slice(0,10);

    var pieChartColors = ['rgb(0, 57, 230)', 'rgb(255, 102, 0)', 'rgb(0, 179, 60)', 'rgb(153, 0, 0)', 'rgb(102, 102, 255)', 'rgb(116, 37, 77)',
                   'rgb(204, 102, 255)', 'rgb(102, 102, 153)', 'rgb(153, 153, 77)', 'rgb(102, 204, 255)' ]

    var trace2 = {
      values: data.sample_values,
      labels: data.otu_ids,
      hoverinfo: data.otu_labels,
      type: 'pie',
      marker: {colors: pieChartColors}
    };

    var layout2 = {
      title: 'OTU ID Vs. Sample Values'
    }

    //How do I get the plot to place in this div ^-
    Plotly.newPlot("pie", trace2, layout2);
  });

}
  


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
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

