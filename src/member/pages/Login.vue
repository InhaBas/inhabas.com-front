<template>
  <!--로딩중일 경우 뜨는 회전하는 원형-->
  <!--  <div id="loading-area"></div>-->
  <div>
    <!-- 로그인창과 배경사진 위치, 크기 설정을 위한 기본 틀 -->
    <div
        class="page-content dlab-login"
        style="background-position: top right; background-blend-mode: screen"
    >

      <!-- 전체 컨테이너 -->
      <div class="container-flex">
        <!--좌측 로그인 창 부분 시작 -->
        <div class="item_flex_lgn login-form-box">
          <div class="login-form2">
            <div class="justify-content-center login-logo-container">
              <img id="logo" onclick="location.href='/'" class="hover:opacity-70" style="width:150px"
                   src="../../assets/images/member_logo.png">
            </div>
            <div>
              <div class="hr-sect">소셜 로그인</div>
              <div class="text-center m-b20">
                <a
                    class="site-button google-plus btn-block text-white"
                ><i class="fa fa-google m-r10"></i> 구글 로그인하기</a
                >
                <a
                    class="site-button whatsapp btn-block text-white"
                ><span class="naver-logo m-r10">N</span> 네이버
                  로그인하기</a
                >
              </div>
            </div>
            <div class="copyright">
              ©INHA BAS All rights reserved.<br/>Developed by 양태영, 신승연, 김채림, 윤예진, 유동현
            </div>
          </div>
        </div>
        <!--          &lt;!&ndash; 오른쪽 이미지를 넣을 장소 시작 &ndash;&gt;-->
        <div class="item_flex_bg">
          <img style="height: 100%;width: 100%"
               src="../../assets/images/blue-purple-technology-circuit.jpg">
        </div>
        <!-- 오른쪽 이미지 넣을 장소 끝 -->
      </div>
    </div>
    <!-- Content END-->
  </div>
</template>

<script>
export default {
  name: "Login.vue",
};
</script>

<style scoped></style>
