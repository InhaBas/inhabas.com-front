import { createApp } from 'vue'
import App from "./App"
import router from './routes/index'
import './index.css'

// import 'https://cdn.inhabas.com/css/posting_list.css';
// import 'https://cdn.inhabas.com/css/templete.min.css';
// import 'https://cdn.inhabas.com/css/ibas_contents.css';
// import 'https://cdn.inhabas.com/css/plugins.css';
// import 'https://cdn.inhabas.com/css/posting_detail.css';


import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

// font-awesome과 관련된 import를 정의
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



//font-awesome
library.add(faUserSecret)

const app = createApp(App);

// 위에 createApp을 통해 생성한 Vue Application 인스턴스의 component API 활용
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.use(BootstrapVue3)



app.mount('#app')


