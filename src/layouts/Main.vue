<template>
<!--  <div id="loading-area"></div>-->
  <div class="page-wraper">
    <!--임시로 넣어둠, 상단바 이후에 블럭처리해서 바꿀예정-->
    <!--====================메뉴바 시작====================-->
    <TopBar></TopBar>
    <!--====================메뉴바 끝====================-->
  </div>

  <div class="page-content bg-white " style="padding-bottom: 0">
    <div class="dlab-bnr-inr height-100-vh" :style="{'background-image':'url('+require('../assets/images/ibas-main-background.jpg')+')'}">
      <div class="container">
        <div class="flex flex-col items-center justify-center dlab-bnr-inr-entry align-m dlab-home">
            <img class="ibas_logo media-logo " onclick="location.href = '/login/'" src="../assets/images/ibas_main_logo.png" alt="현재 브라우저에서 지원하지 않는 형식입니다.">
            <div class="m-t50"><img src="../assets/images/main-text.png" alt="현재 브라우저에서 지원하지 않는 형식입니다."></div>
          <div onclick="location.href = '../../login'" class="category-bx" style="margin-top: 100px; margin-bottom: 100px">
            <a href="#" class="category">
              <p style=" font-weight: bolder; font-size: 20px; padding-top: 12px">입부신청</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer 하단바 시작 -->
  <FooterBar></FooterBar>
  <!-- Footer END-->
  <button class="scroltop fa fa-chevron-up"></button>

</template>

<script>
import TopBar from "@/common/TopBar";
import FooterBar from "@/common/FooterBar";

export default {
  name: "Main.vue",
  components:{TopBar,FooterBar},
}
</script>

<style>
@import "../assets/css/top-bottom.css";
</style>