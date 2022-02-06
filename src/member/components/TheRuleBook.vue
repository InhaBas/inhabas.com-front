<template>
  <div
      class="page-content dlab-login bg-primary"
      style="background-position: top right; background-blend-mode: screen"
  >
    <div class="container-flex">
      <!-- 화면 왼쪽 약관 내용부분 -->
      <div class="item_flex_join login-form-box">
        <!-- 여기서부터 약관 시작  -->
        <div class="join-form2">
          <div class="form-center-position form-width-large mt-5">
            <!-- 약관 제목 -->
            <!-- 약관 종류에 따라, 개인정보 제공 동의 약관 / 동아리 회칙 등을 DB에서 꺼냐와야 함 -->
            <h1 class="font-nanumGothicBold">개인정보 제공 동의 약관</h1>
            <hr/>
            <!-- 태크를 붙여둔 상태로 DB에 저장/불러오기 해야 함 -->
            개인정보 제공 동의약관 내용
          </div>
        </div>
        <div class="text-center">
          <button class="btn site-button" type="button" onclick="history.back()">돌아가기</button>
        </div>
      </div>
      <!-- 화면 오른쪽 그림 div -->
      <div class="item_flex_bg">
        <img style="height: 100%; width: 100%" src="../../assets/images/blue-purple-technology-circuit.jpg" alt="">
      </div>
    </div>





  </div>
</template>

<script>
export default {
  name: "TheRuleBook.vue"
}
</script>

<style scoped>

</style>