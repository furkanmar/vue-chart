import { createApp } from 'vue';
import App from './App.vue';
import VueApexCharts from 'vue3-apexcharts'
import '../node_modules/bootstrap/dist/css/bootstrap.css';

// Uygulamayı oluştur
const app = createApp(App);

app.use(VueApexCharts)
app.component('apex-chart', VueApexCharts)
app.mount('#app');




