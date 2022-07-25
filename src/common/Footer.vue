<template>
  <footer class="footer-media">
    <!-- content 담는 부분이 footer-top -->
    <!-- footer-top에 대한 정의는 bottom_bar.css에 정의되어 있음. (height 관련) -->
    <div class="ibas-footer-top media-footer-bg"
         :style="{'background-image' : 'url('+require('/src/assets/images/botton_bar.jpg')+')','background-size': 'cover'}">
      <!-- content 시작 -->
      <!-- cont-grid에 대한 정의는 bottom_bar.css에 정의되어 있음. (grid 관련) -->
      <div class="cont-grid media-ft-flex">
        <!-- 로고 div 시작 -->
        <!-- logo-center에 대한 정의는 bottom_bar.css에 정의되어 있음. (grid 관련) -->
        <div class="logo-center media-tb-mg30 media-logo">
          <!-- 여기 부분이 이미지임   -->
          <!-- width_300에 대한 정의는 bottom_bar.css에 정의되어 있음. (width 관련) -->
          <img src="../assets/images/logo_white.png" class="m-b15" alt="" style="width: 350px">
        </div>
        <div class="media-line-ft dis-none"></div>
        <!-- 로고 div 끝 -->
        <!-- contact us div 시작 -->
        <!-- margin-left_70에 대한 정의는 bottom_bar.css에 정의되어 있음. (margin 관련) -->
        <div class="m-t10 media-tb-mg30 media-r-mg0 cont-w">
          <h5 class="mb-2 text-white">Contact us</h5>
          <!-- contact us table 시작 -->
          <!-- padding_0에 대한 정의는 bottom_bar.css에 정의되어 있음. (padding 관련) -->
          <table class="p-0">
            <tr>
              <!-- td-size_small에 대한 정의는 bottom_bar.css에 정의되어 있음. (size 관련) -->
              <td class="td-size_small"><i class="fa fa-user"></i></td>
              <!-- td-size_big에 대한 정의는 bottom_bar.css에 정의되어 있음. (size 관련) -->
              <td class="td-size_big">chief.user_name (회장)</td>
            </tr>
            <tr>
              <td class="td-size_small"><i class="ti-location-pin"></i></td>
              <td class="td-size_big">인하대학교 22212 인천광역시 미추홀구 인하로 100</td>
            </tr>
            <tr>
              <td class="td-size_small"><i class="ti-mobile"></i></td>
              <td class="td-size_big">chief.user_phone</td>
            </tr>
            <tr>
              <td class="td-size_small"><i class="ti-email"></i></td>
              <td class="td-size_big">chief.useremail_set.first.user_email</td>
            </tr>
          </table>

        </div>
        <div class="media-line-ft dis-none"></div>
        <!-- contact us div 끝 -->
        <!-- 인하대 로고 div 시작 -->
        <!-- logo-center에 대한 정의는 bottom_bar.css에 정의되어 있음. (grid 관련) -->
        <div class="logo-center media-tb-mg30 media-logo">
          <!-- 여기 부분이 이미지임 -->
          <a href="https://www.inha.ac.kr">
            <!-- width_300에 대한 정의는 bottom_bar.css에 정의되어 있음. (width 관련) -->
            <img src="../assets/images/inha_en_logo.png" class="m-b15 p-r50 media-r-mg0 media-pr-0" alt=""
                 style="width: 450px;">
          </a>
        </div>
        <!-- 인하대 로고 div 끝 -->

      </div>
    </div>
    <div class="footer-bottom text-center mx-auto text-white dis-none-media" style="padding-bottom: 0px">
      <a class="font-12" href="#">제 3자 개인정보 이용·수집제공 약관</a>&nbsp;
      <a class="font-12 m-l5 m-r5">·</a>&nbsp;
      <a class="font-12" href="#">동아리 회칙</a>&nbsp;
      <a class="font-12 m-l5 m-r5">·</a>&nbsp;
      <a class="font-12" href="#">웹사이트 운영정책</a>
    </div>
    <!-- copyright 부분 시작 -->
    <!-- footer-bottom, min-width_1400에 대한 정의는 bottom_bar.css에 정의되어 있음. (flex 관련)(min-with 관련) -->
    <div class="footer-bottom media-dvl-name" style="min-width: 100%">
      <!-- design-with에 대한 정의는 bottom_bar.css에 정의되어 있음. (font, margin 관련) -->
      <p class="fbottom-like design-with">© 2021 Developed By
        <a class="like-btn" href="javascript:void(0)">
        </a>
        양태영, 신승연, 김채림, 윤예진, 유동현
      </p>
    </div>
  </footer>
  <button class="scroltop fa fa-chevron-up"></button>
</template>

<script>
export default {
  name: "Footer.vue"
}
</script>

<style scoped>

</style>