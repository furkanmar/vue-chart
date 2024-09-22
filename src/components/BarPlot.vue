<template>
    <div>
      <apexchart type="line" :options="chartOptions" :series="chartSeries"></apexchart>
    </div>
  </template>
  
  <script setup>
  import { defineProps, ref, watch,computed } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  // Parent'ten gelen props verisini alıyoruz
  const props = defineProps({
    datas: {
      type: Array,
      required: true
    },
    range: {
      type: Number, // Büyük harfle Number
      required: true
    }
  });
  
  // Haftalık veriler ve surplus/deficit hesaplamaları için ref tanımları
  const weeklyData = ref([]);
  const surplusOrDeficit = ref([]);
  
  // 7'şerli gruplama fonksiyonu
  const groupByWeeks = () => {
    const chunkedData = [];
    for (let i = 0; i < props.datas.length; i += props.range) {
      const chunk = props.datas.slice(i, i + props.range); // Kullanıcının belirttiği aralıkta grup oluşturma
      const weekData = {
        Production: chunk.reduce((sum, d) => sum + d.Production, 0),
        Consumption: chunk.reduce((sum, d) => sum + d.Consumption, 0),
        Stock_Increase: chunk.reduce((sum, d) => sum + d.Stock_Increase, 0),
        Stock_Decrease: chunk.reduce((sum, d) => sum + d.Stock_Decrease, 0),
        End_Stock: chunk.reduce((sum, d) => sum + d.End_Stock, 0),
        weekStart: chunk[0].Date // Haftanın başlangıç tarihi
      };
      chunkedData.push(weekData);
    }
    weeklyData.value = chunkedData;
  };
  
  // Surplus/Deficit hesaplama fonksiyonu
  const calculateSurplusOrDeficit = () => {
    surplusOrDeficit.value = weeklyData.value.map(week => ({
      weekStart: week.weekStart,
      surplusOrDeficit: week.Stock_Increase - week.Stock_Decrease
    }));
  };
  
  // Datas ve range her değiştiğinde gruplama ve hesaplama yapılır
  watch(() => [props.datas, props.range], () => {
    groupByWeeks(); // Gruplama
    calculateSurplusOrDeficit(); // Surplus/Deficit hesaplama
  });
  
  // Grafik ayarları
  const chartOptions = {
    chart: {
      type: 'line',
      stacked: false
    },
    stroke: {
      width: [1, 2,3, 3], // Bar ve line genişlikleri
    },
    xaxis: {
      categories: computed(() => weeklyData.value.map(d => d.weekStart)), // Haftalık veriler için x ekseni
    },
    yaxis: [
    {
      seriesName: 'Production',
      
      axisTicks: 
      {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#008FFB'
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(0);
        },
        style: {
          colors: '#008FFB',
        }
      },
      title: {
        text: "Production",
        style: {
          color: '#008FFB',
        }
      },
      tooltip: {
        enabled: true
      }
              
    },
    {
      seriesName: 'Consumption',
      axisTicks: 
      {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#00E396'
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(0);
        },
        style: {
          colors: '#00E396',
        }
      },
      title: {
        text: "Consumption",
        style: {
          color: '#00E396',
        }
      },
      tooltip: {
        enabled: true
      }
    },
    
    {
      opposite:true,
      seriesName: 'Surplus/Deficit',
      axisTicks: 
      {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#FF4560'
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(0);
        },
        style: {
          colors: '#FF4560',
        }
      },
      title: {
        text: "Surplus/Deficit",
        style: {
          color: '#FF4560',
        }
      },
      tooltip: {
        enabled: true
      }
    },
    {
      opposite:true,
      seriesName: 'End Stock',
      axisTicks: 
      {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#3a023f'
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(0);
        },
        style: {
          colors: '#3a023f',
        }
      },
      title: {
        text: "End Stock",
        style: {
          color: '#3a023f',
        }
      },
      tooltip: {
        enabled: true
      }
    },
        
      
    ],
    colors: ['#008FFB', '#00E396', '#FF4560','#3a023f'], // Bar grafiği için renkler
    tooltip: {
      shared: true,
      intersect: false,
    },
    markers: {
      size: 3,
      colors: ['#FF4560'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 4,
      }
    },
  };
  
  // Tek bir seri ile hem bar hem de line için veri seti
  const chartSeries = ref([
    {
      name: 'Production',
      type: 'column',
      data: computed(() => weeklyData.value.map(d => d.Production)) // Production verisi
    },
    {
      name: 'Consumption',
      type: 'column',
      data: computed(() => weeklyData.value.map(d => d.Consumption)) // Consumption verisi
    },
    {
      name: 'Surplus/Deficit',
      type: 'line',
      data: computed(() => surplusOrDeficit.value.map(d => d.surplusOrDeficit)) // Surplus/Deficit verisi
    },
    {
      name: 'End Stock',
      type: 'line',
      data: computed(() => weeklyData.value.map(d => d.End_Stock)) // End Stock verisi
    }
  ]);
  
  const apexchart = VueApexCharts;
  </script>
