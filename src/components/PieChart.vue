<template>
    
    <div class="chart-container">
        <div class="pie">
            <h2>Production Chart</h2>
            <apexchart 
                type="pie" 
                :options="chartOptions" 
                :series="productionSeries" 
                @dataPointSelection="onSliceClick"
            />
        
            <h2>Consumption Chart</h2>
            <apexchart 
                type="pie" 
                :options="chartOptions" 
                :series="consumptionSeries" 
                @dataPointSelection="onSliceClick"
            />
        </div>
        <div v-if="sideGraphisLine" >
            <div v-if="sideChartShow" style="width: 70vw;">
                <LineChart 
                :productName="productName" 
                :productionData="productData.map(item => item.production)" 
                :consumptionData="productData.map(item => item.consumption)"
                :range="range"
                />
            </div>
            <div class="gap-2" v-if="sideChartShow" style="display: flex; justify-content: center; align-items: center;">
                <input type="number" v-model="range" placeholder="Aralık girin.." />
                <div class="btn btn-primary" @click="range = 7">7 günlük</div>
                <div class="btn btn-primary" @click="range = 30">30 günlük</div>
                <div class="btn btn-primary" @click="range = 60">60 günlük</div>
                <div class="btn btn-danger" @click="sideChartShow=false">Kapat</div>
            </div> 
        </div>
        <div v-else-if="sideGraphisBoxPlot">
            <div v-if="sideChartShow" style="width: 70vw;">
                <BoxPlot 
                :productName="productName" 
                :productionData="productData.map(item => ({ production: item.production }))" 
                :consumptionData="productData.map(item => ({ consumption: item.consumption }))"
                :range="rangeBox"
                />
            </div>
            <div class="gap-2" v-if="sideChartShow" style="display: flex; justify-content: center; align-items: center;">
                <input type="number" v-model="rangeBox" placeholder="Aralık girin.." />
                
                <div class="btn btn-primary" @click="rangeBox = 30">30 günlük</div>
                <div class="btn btn-primary" @click="rangeBox = 60">60 günlük</div>
                <div class="btn btn-danger" @click="sideChartShow=false">Kapat</div>
            </div>

        </div>
    
        
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps,ref,watch,onMounted} from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
import LineChart from './LineChart.vue';
import BoxPlot from './BoxPlot.vue';

const sideChartShow=ref(false);
  
  
  const props = defineProps({
    dataProducts: Array,
    sideGraph:String,
  });
  const sideGraphisLine=ref(false);
  const sideGraphisBoxPlot=ref(false);
  const rangeBox=ref(30);

  onMounted(()=>{
    if(props.sideGraph=='Line'){
        sideGraphisLine.value=true;
    }
    if(props.sideGraph=='BoxPlot'){
        sideGraphisBoxPlot.value=true;
    }    
  });

  const range=ref(10);
  watch(range, (newValue) => {
    if (newValue === null || newValue === '' || newValue <= 0) {
        range.value = 10; 
    }
    });
    watch(rangeBox, (newValue) => {
    if (newValue === null || newValue === '' || newValue <= 0) {
        rangeBox.value = 10; 
    }
    });

  
  // Üretim ve tüketim için toplam değerleri hesaplama
  const totalProductionByProduct = computed(() => {
    let totals = { A: 0, B: 0, C: 0, D: 0 };
  
    props.dataProducts.forEach(item => {
      totals.A += item.A_Production || 0;
      totals.B += item.B_Production || 0;
      totals.C += item.C_Production || 0;
      totals.D += item.D_Production || 0;
    });
  
    return [totals.A, totals.B, totals.C, totals.D];
  });
  
  const totalConsumptionByProduct = computed(() => {
    let totals = { A: 0, B: 0, C: 0, D: 0 };
  
    props.dataProducts.forEach(item => {
      totals.A += item.A_Consumption || 0;
      totals.B += item.B_Consumption || 0;
      totals.C += item.C_Consumption || 0;
      totals.D += item.D_Consumption || 0;
    });
  
    return [totals.A, totals.B, totals.C, totals.D];
  });
  
  // Üretim ve tüketim için chart serileri
  const productionSeries = computed(() => totalProductionByProduct.value);
  const consumptionSeries = computed(() => totalConsumptionByProduct.value);
  
  // Chart ayarları
  const chartOptions = {
    chart: {
      width: '100%',
      height: '100%',
      type: 'pie',
    },
    labels: ['A', 'B', 'C', 'D'],
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    grid: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    dataLabels: {
      formatter(val, opts) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + '%'];
      },
    },
    legend: {
      show: false,
    },
  };
  
const productData =ref([])
const productName=ref('');
  
  // Dilime tıklama olayını yönetme
  const onSliceClick = (event, chartContext, config) => {
    sideChartShow.value=false;
    const productIndex = config.dataPointIndex; // Tıklanan dilimin indeksi
    productName.value = config.w.globals.labels[productIndex]; // Ürün adı
    
  
    console.log(`Selected product:  Product ${productName.value}`); // Burada istediğiniz fonksiyonu çağırabilirsiniz
    productData.value = props.dataProducts.map(item => ({
    date: item.Date,
    production: item[`${productName.value}_Production`] || 0,
    consumption: item[`${productName.value}_Consumption`] || 0,
  }));
  console.log(productData.value);
  console.log(productName.value);
  sideChartShow.value=true;
  
};
  
  const apexchart = VueApexCharts;
  </script>
  
  <style scoped>
  .chart-container {
    margin-top: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .pie{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  </style>
  