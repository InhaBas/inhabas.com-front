import { createApp } from 'vue'
import App from "./App"
import router from './routes/index' //router 도입
import './index.css' // tailwind.css
import Particles from "particles.vue3"; // std_or_pro 뒷 배경 애니메이션

const app = createApp(App);

app.use(router)
app.use(Particles)
app.mount('#app')


