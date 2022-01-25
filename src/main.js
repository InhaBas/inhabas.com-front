import { createApp } from 'vue'
import App from "./App"
import router from './routes/index' //router 도입
import './index.css' // tailwind.css

const app = createApp(App);

app.use(router)

app.mount('#app')


