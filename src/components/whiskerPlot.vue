<template>
    <div>
      <input type="file" @change="loadCSV" />
      <div ref="plot"></div>
    </div>
  </template>
  
  <script>
  import Papa from 'papaparse';
  import Plotly from 'plotly.js-dist';
  
  export default {
    methods: {
      loadCSV(event) {
        const file = event.target.files[0];
        if (!file) return;
  
        Papa.parse(file, {
          complete: (results) => {
            const data = results.data;
            this.drawPlot(data);
          },
          header: true,
        });
      },
  
      drawPlot(data) {
        // CSV'den alınan verileri işleme
        const yValues = data.map(row => parseFloat(row['YourColumnName']));
  
        const trace = {
          y: yValues,
          type: 'box',
          name: 'Whisker Plot',
        };
  
        const layout = {
          title: 'Whisker Plot',
          yaxis: { title: 'Values' },
        };
  
        Plotly.newPlot(this.$refs.plot, [trace], layout);
      }
    }
  };
  </script>
  