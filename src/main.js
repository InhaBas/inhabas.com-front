import { createApp } from 'vue'
import App from "./App"
import router from './routes/index' //router 도입
import './index.css' // tailwind.css
// import Vuex from "vuex"
import axios from 'axios'
import VueAxios from 'vue-axios'
import Particles from "particles.vue3"; // std_or_pro 뒷 배경 애니메이션
import VueCookies from 'vue3-cookies'

// custom css import
// import "../src/assets/css/comment.css"
// import "../src/assets/css/ibas_contents.css"
// import "../src/assets/css/imageuploadify.min.css"
// import "../src/assets/css/jquery-te-1.4.0.css"
// import "../src/assets/css/login-join.css"
// import "../src/assets/css/media.css"
// import "../src/assets/css/nav.css"
// import "../src/assets/css/plugins.css"
// import "../src/assets/css/posting_list.css"
// import "../src/assets/css/posting_detail.css"
// import "../src/assets/css/posting_register.css"
// import "../src/assets/css/size.css"
// import "../src/assets/css/star-rating-svg.css"
// import "../src/assets/css/style.css"
// import "../src/assets/css/top-bottom.css"
//
import "../src/assets/css/templete.min.css"
import "../src/assets/css/ibas_contents.css"
import "../src/assets/css/posting_detail.css"
import "../src/assets/css/login-join.css"
import "../src/assets/css/size.css"
import "../src/assets/css/media.css"
import "../src/assets/css/top-bottom.css"

// font import
// import "../src/assets/font/NanumBarunGothic.otf"

// custom js import
import "../src/assets/js/login-join.js"

const app = createApp(App);

app.use(router)
app.use(VueAxios, axios)
app.use(Particles)
app.use(VueCookies)
app.mount('#app')
