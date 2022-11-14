
// Reading the JSON data 


const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
async function getD3 () {
    let data = false;
    try{
        data = await d3.json(dataURL)
    }catch(err){
        console.error(err)
    }
    return data;
   
}


let sampleData;
window.onload =async ()=>{
   
    sampleData = await getD3();
    let selectedMeta = sampleData.metadata.find(each=>each.id==940);
    let washData = selectedMeta.wfreq;
    selectData(selectedMeta);
    buildMetadata(sampleData.names);
    buildPlot(sampleData.samples[0]);
    buildGauge(washData);
 
}

//  Creating function
function buildPlot(samples) {
    // console.log("function started")
   
     let data = samples;
     
        //2. Creating horizontal barchart
        
        let otuIDS = data.otu_ids;
        let otuLabels = data.otu_labels;
        let sampleValues = data.sample_values;
        
        let traceBar = {
            type: "bar",
            x: sampleValues.slice(0, 10).reverse(),
            y: otuIDS.slice(0, 10).map(item => `OTU${item}`).reverse(),
            text: otuLabels.slice(0, 10).reverse(),
            orientation: "h"
        };
       
        let dataBar = [traceBar];

        let layoutBar = {
            title: "Top 10 OTUs",
            xaxis: { title: "OTU ID" },
            showlegend: false

        };

    
        Plotly.newPlot("bar", dataBar, layoutBar);




        // 3. Creating a bubble chart displaying each sample
        let traceBubble = {
            x: otuIDS,
            y: sampleValues,
            text: otuLabels,
 
            mode: "markers",
            marker: {
                size: sampleValues,

                color: otuIDS,
                colorscale: "Earth"
            },
        }

    
        let dataBubble = [traceBubble];
        let layoutBubble = {
            x: { title: "OTU ID" }
        };

        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", dataBubble, layoutBubble)
}

//  metadata function
function buildMetadata(names) {
    // console.log("metadata started")

    // //4. Display the sample metadata: an individual demographic information
    let metadata = names;
        result = metadata;

        // //5. Display each key-value pair from the metadata JSON object somewhere on the page 
        // Render the plot to the div tag with id "sample-metadata"
        let sampleMetadata = d3.select("#selDataset");
      
        sampleMetadata.html("");

        Object.entries(result).forEach(([key, value]) => {
            sampleMetadata.append("option").text(`${value}`);
            // console.log(key, value);

        })
}


//  function for the demographic change event option button which will change all plots automatically
function optionChanged(event) {
    let selectedSample = sampleData.samples.find(each=>each.id==event);
    buildPlot(selectedSample)
    // console.log(event)

    let sampleMeta  =sampleData.metadata.find(each=>each.id==event);
    selectData(sampleMeta);
    let washFreq = sampleData.metadata.find(each=>each.id==event)
    buildGauge(washFreq.wfreq)
    // console.log(washFreq)

}
// 6. Update all the plots when a new sample is selected
function selectData(names) {
    // console.log("selection started",names)
    let select = d3.select("#sample-metadata");
    select.html("")

    let keys = Object.keys(names);
    let values= Object.values(names);
    let length =keys.length;
    for(let i=0;i<length;i++){
        select.append("p").text(keys[i]+" : "+values[i]);
    }
}

