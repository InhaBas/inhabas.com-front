<template>
  <!--제목을 감싸는 배경-->
  <div class="dlab-bnr-inr dlab-bnr-inr-sm overlay-black-middle"
       style="background-image: url('https://cdn.inhabas.com/images/board_name_img.jpg'); height: 350px">
    <!-- 상단 제목을 클릭하면, 상위 게시판으로 이동 -->
    <a class="text-decoration-none" href="#">
      <div class="container clearfix">
        <div class="dlab-bnr-inr-entry">
          <!--제목-->
          <!-- DB에서 제목 꺼내와야 함 공모전, 강의, 취미-->
          <h1 class="text-white introduce-letter-spacing_5">공모전 게시판</h1>
          <!--부제목-->
          <!-- DB에서 부제목 꺼내와야 함 공모전, 강의, 취미 -->
          <p class="m-t20">공모전 정보를 알려주는 게시판</p>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "HeaderTitle.vue"
}
</script>

<style scoped>

</style>