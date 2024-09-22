<template>
    <div class="line-chart-container">
      <h3>{{ productName }} - Production & Consumption</h3>
      <apexchart type="line" :options="chartOptions" :series="chartSeries" />
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps, watch, ref } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  const props = defineProps({
    productName: String,
    productionData: Array,
    consumptionData: Array,
    range: Number,
  });
  
  
  const groupData = (data) => {
    const grouped = [];
    for (let i = 0; i < data.length; i += props.range) {
      const weekData = data.slice(i, i + props.range);
      const total = weekData.reduce((sum, item) => sum + item, 0);
      grouped.push(total);
    }
    return grouped;
  };
  
  
  const groupedProductionData = ref([]);
  const groupedConsumptionData = ref([]);
  
  
  
  watch(
    () => [props.productionData, props.consumptionData, props.range],
    () => {
      groupedProductionData.value = groupData(props.productionData);
      groupedConsumptionData.value = groupData(props.consumptionData);
      
    },
    { immediate: true } 
  );
  
const calculateAverage = (data) => {
  const total = data.reduce((sum, item) => sum + item, 0);
  return total / data.length || 0;
};


const averageProduction = computed(() => calculateAverage(groupedProductionData.value));
const averageConsumption = computed(() => calculateAverage(groupedConsumptionData.value));


  

  const chartSeries = computed(() => [
  {
    name: 'Production',
    data: groupedProductionData.value,
    color: '#28a745', // Yeşil
    
  },
  {
    name: 'Consumption',
    data: groupedConsumptionData.value,
    color: '#dc3545', // Kırmızı
  },
  {
    name: 'Average Production',
    data: Array(groupedProductionData.value.length).fill(averageProduction.value), 
    color: '#007bff', // Mavi
    
  },
  {
    name: 'Average Consumption',
    data: Array(groupedConsumptionData.value.length).fill(averageConsumption.value), 
    color: '#ffc107', // Sarı
    
  },
  ]);
  
  const chartOptions = {
  chart: { height: 350, type: 'line' },
  title: { text: 'Production and Consumption Over Time', align: 'center' },
  
  stroke: { curve: 'smooth' },
  
  markers: { size: 2},
  legend: { position: 'top' },
  
  yaxis: {
    title: {
      text: 'Quantity',
      style: {
        color: '#333', 
        fontSize: '14px', 
        fontWeight: 600,
      },
    },
    labels: {
      formatter: (value) => value.toFixed(0), 
      style: {
        colors: '#333', 
        fontSize: '12px', 
      },
    },
    tickAmount: 10, 
  },
  axisTicks: 
      {
        show: true,
      },
      tooltip: {
        enabled: true
      }
};

  
  const apexchart = VueApexCharts;
  </script>
  
  <style scoped>
  .line-chart-container {
    width: 100%;
    padding: 20px;
  }
  </style>
  