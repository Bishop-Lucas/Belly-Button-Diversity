function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Create data filter for samples
      var sampleArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = sampleArray[0];
      // Select requested panel
      var PANEL = d3.select("#sample-metadata");
  
      // clears existing data
      PANEL.html("");
  
      // create key pairs using a foreach loop
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
      // Build bonus
      buildGauge(result.wfreq);
    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      // Create data filter for sample of interest
      var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = sampleArray[0];
  
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Build a Bubble Chart
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Portland"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });
  }

  function init() {
    // Grab from dropdown
    var selector = d3.select("#selDataset");
  
    // Create the select options from the list of samples
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Build initial charts with first sample
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Get new data for new selections
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
 
  init();
  



























