import { VueElement, createApp } from 'vue'
import App from './App.vue'
import './index.css'

import { init } from './utils/csharpcomm'

init();

const app = createApp(App);
app.mount('#app')
