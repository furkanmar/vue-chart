<template>
    <div class="box-plot-container">
      <h3>{{ productName }} - Production Box Plot</h3>
      <apexchart type="boxPlot" :options="productionChartOptions" :series="productionChartSeries" />
      
      <h3>{{ productName }} - Consumption Box Plot</h3>
      <apexchart type="boxPlot" :options="consumptionChartOptions" :series="consumptionChartSeries" />
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps, watch, ref } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  // Props olarak gelen veriler
  const props = defineProps({
    productName: String,
    productionData: Array,
    consumptionData: Array,
    range: Number,
  });
  
  // Yardımcı fonksiyon: BoxPlot verilerini hesaplama (min, q1, median, q3, max)
  const calculateBoxPlotValues = (data) => {
    if (data.length === 0) return [0, 0, 0, 0, 0];
  
    const sorted = data.slice().sort((a, b) => a - b); // Veriyi sıralıyoruz
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    const median = sorted[Math.floor(sorted.length / 2)];
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor(3 * sorted.length / 4)];
  
    return [min, q1, median, q3, max]; // ApexCharts'ın beklediği format
  };
  
  // Gruplama fonksiyonu
  const groupData = (data, type) => {
    const grouped = [];
    for (let i = 0; i < data.length; i += props.range) {
      const group = data.slice(i, i + props.range);
      const values = group.map(item => item[type]).filter(val => val !== undefined && val !== null);
      
      // Eğer değerler boş değilse grup ekle
      if (values.length > 0) {
        grouped.push(calculateBoxPlotValues(values));
      }
    }
    return grouped;
  };
  
  // Gruplama için referanslar
  const groupedProductionData = ref([]);
  const groupedConsumptionData = ref([]);
  
  // Watch ile gruplamayı güncelle
  watch(
    () => [props.productionData, props.consumptionData, props.range],
    () => {
      groupedProductionData.value = groupData(props.productionData, 'production');
      groupedConsumptionData.value = groupData(props.consumptionData, 'consumption');
    },
    { immediate: true }
  );
  
  // Minimum ve maksimum değerleri bulma (tampon eklemek için)
  const findMinMax = (data) => {
    if (data.length === 0) return { min: 0, max: 0 };
  
    const allValues = data.flat();
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
  
    return {
      min: min - Math.abs(min) * 0.1, // %10 daha düşük
      max: max + Math.abs(max) * 0.1, // %10 daha yüksek
    };
  };
  
  // Production için BoxPlot serileri
  const productionChartSeries = computed(() => {
    return [{
      name: 'Production',
      data: groupedProductionData.value.map((group, index) => ({
        x: `Group ${index + 1}`,
        y: group, // y: [min, q1, median, q3, max]
      })),
    }];
  });
  
  // Consumption için BoxPlot serileri
  const consumptionChartSeries = computed(() => {
    return [{
      name: 'Consumption',
      data: groupedConsumptionData.value.map((group, index) => ({
        x: `Group ${index + 1}`,
        y: group, // y: [min, q1, median, q3, max]
      })),
    }];
  });
  
  // Production ve consumption için min-max hesapla
  const productionMinMax = computed(() => findMinMax(groupedProductionData.value));
  const consumptionMinMax = computed(() => findMinMax(groupedConsumptionData.value));
  
  // Chart ayarları
  const productionChartOptions = computed(() => ({
    chart: {
      type: 'boxPlot',
    },
    title: {
      text: 'Production Box Plot',
    },
    xaxis: {
      type: 'category',
    },
    yaxis: {
      min: productionMinMax.value.min,
      max: productionMinMax.value.max,
    },
  }));
  
  const consumptionChartOptions = computed(() => ({
    chart: {
      type: 'boxPlot',
    },
    title: {
      text: 'Consumption Box Plot',
    },
    xaxis: {
      type: 'category',
    },
    yaxis: {
      min: consumptionMinMax.value.min,
      max: consumptionMinMax.value.max,
    },
  }));
  
  const apexchart = VueApexCharts;
  </script>
  
  
  <style scoped>
  .box-plot-container {
    width: 100%;
    padding: 20px;
  }
  </style>
  