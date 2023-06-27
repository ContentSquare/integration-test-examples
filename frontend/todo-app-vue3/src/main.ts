import { createApp } from 'vue';
import axios from 'axios';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();

axios.defaults.baseURL = 'http://localhost:3000';

createApp(App)
    .use(pinia)
    .mount('#app');
