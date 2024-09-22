<template>
  <div class="container mt-5 mb-5">
    <div v-show="true">
      <div>
        <BarPlot 
          :datas="dataGeneral"
          :range="range"
        />
      </div>
      <div class="gap-2" style="display: flex; justify-content: center; align-items: center;">
        <input type="number" v-model="range" placeholder="Aralık girin.." />
        <div class="btn btn-primary" @click="range = 7">7 günlük</div>
        <div class="btn btn-primary" @click="range = 30">30 günlük</div>
        <div class="btn btn-primary" @click="range = 60">60 günlük</div>
      </div>
    </div>

    <div v-show="true">
      <PieChart :dataProducts="dataProducts" :sideGraph="'Line'"/>

    </div>
    <div v-show="true">
      <PieChart :dataProducts="dataProducts" :sideGraph="'BoxPlot'"/>

    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Papa from 'papaparse';
import BarPlot from './components/BarPlot.vue'; 
import PieChart from './components/PieChart.vue';

const dataGeneral = ref([]);
const dataProducts = ref([]);

const range = ref(7);

// Veriyi fetch etme fonksiyonu
const fetchDataGeneral = async () => {
  const response = await fetch('/factory_stock_data.csv');
  const csvText = await response.text();
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: function (result) {
      const data = result.data;
      dataGeneral.value = data.map(d => ({
        Date: d.Date,
        Initial_Stock: +d.Initial_Stock,
        Production: +d.Production,
        Consumption: +d.Consumption,
        Stock_Increase: +d.Stock_Increase,
        Stock_Decrease: +d.Stock_Decrease,
        End_Stock: +d.End_Stock
      }));
    }
  });
};

const fetchDataProducts=async ()=>{
  const response = await fetch('/product_production_consumption.csv');
  const csvText = await response.text();
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: function (result) {
      const data = result.data;
      dataProducts.value = data.map(d => ({
        Date: d.Date,
        A_Production: +d.Product_A_Production,
        A_Consumption: +d.Product_A_Consumption,
        B_Production: +d.Product_B_Production,
        B_Consumption: +d.Product_B_Consumption,
        C_Production: +d.Product_C_Production,
        C_Consumption: +d.Product_C_Consumption,
        D_Production: +d.Product_D_Production,
        D_Consumption: +d.Product_D_Consumption
      }));
    }
  });

}

// Range değişkenini izleme
watch(range, (newValue) => {
  if (newValue === null || newValue === '' || newValue <= 0) {
    range.value = 1; // Değer 1'e eşitleniyor
  }
});

onMounted(() => {
  fetchDataGeneral();
  fetchDataProducts();
});
</script>
