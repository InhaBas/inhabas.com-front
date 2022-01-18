import { createApp } from 'vue'
import App from "./App"
import router from './routes/index'
import './index.css'

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



app.mount('#app')


