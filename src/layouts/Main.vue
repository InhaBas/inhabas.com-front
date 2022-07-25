<template>
<!--  <div id="loading-area"></div>-->
  <div class="page-wraper">
    <!--임시로 넣어둠, 상단바 이후에 블럭처리해서 바꿀예정-->


    <div class="page-content bg-white " style="padding-bottom: 0">
      <div class="dlab-bnr-inr height-100-vh" :style="{'background-image':'url('+require('../assets/images/ibas-main-background.jpg')+')'}">
        <div class="container">
          <div class="dlab-bnr-inr-entry align-m dlab-home flex flex-column justify-content-center align-items-center">
              <img class="ibas_logo media-logo " onclick="location.href = '/login/'" src="../assets/images/ibas_main_logo.png" alt="현재 브라우저에서 지원하지 않는 형식입니다.">
              <div class="m-t50"><img src="../assets/images/main-text.png" alt="현재 브라우저에서 지원하지 않는 형식입니다."></div>
            <div onclick="location.href = '../../login'" class="category-bx" style="width: 80%; margin-top: 100px; margin-bottom: 100px">
              <a href="#" class="category" style="width: 60%">
                <p style=" font-weight: bolder; font-size: 20px; padding-top: 12px">입부신청</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>

</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";
export default {
  name: "Main.vue",

  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },

  created() {
    const urlParams = new URL(location.href).searchParams;

    if (urlParams.has('access_token')) {
      const accessToken = urlParams.get('access_token');

      this.cookies.set("accessToken", accessToken);

      const access = this.cookies.get("accessToken")



      // request interceptors
      axios.interceptors.request.use(
          function (config) {
            // config.headers.Authorization = access
            config.headers.Authorization = access ? `Bearer ${access}` : "";
            return config;
          }, function (error) {
            // 요청에러 처리
            return Promise.reject(error);
          });

      // url 파라미터 삭제
      history.replaceState({}, null, location.pathname)





    }
  },


}
</script>

<style>
@import "../assets/css/top-bottom.css";
</style>