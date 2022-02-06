<template>
  <div class="page-wraper">
    <!-- Content -->
    <div
        class="dlab-login"
        style="background-position: top right; background-blend-mode: screen"
    >
      <div class="container-flex">
        <div class="item_flex_join login-form-box">
          <!-- 여기서부터 로그인 양식 시작  -->
          <div class="join-form2">
            <div class="form-center-position form-width-large mt-3 media-m-50">

                <!--POST전송을 위한 CSRF 토큰-->

                <!-- 입부신청 작성란 시작 -->
                <!-- 서술형 질문 시작-->
                <div id="register" class="tab-pane active mt-5">
                  <!-- 가입시 질문 작성란  -->
                  <div class="form-group">
                    <h5 class="text-inherit m-b10">
                      gd
                    </h5>
                    <div class="wrap">
                                            <textarea
                                                name="answer_"
                                                required="required"
                                                class="form-textarea_size form-text-area-size-add quest-textarea-h"
                                                placeholder="내용을 입력하세요."
                                                type="text"
                                            ></textarea>
                    </div>
                  </div>

                  <!-- 개인정보사용동의란이 있다면 사용해야 할 체크박스와 상세 내용 -->
                  <div class="submit-btn-center mb-5 media-dis-block">
                    <!-- 체크 박스, 동의 문구 컨테이너 -->
                    <div style="display: flex; flex-direction: column">
                      <!-- 개인정보 제공 동의 컨테이너 -->
                      <div class="form-group item_flex_btn_center mb-0">
                        <input type="checkbox" id="privacy-policy" required="required"/>
                        <label for="privacy-policy"
                        >본인은
                          <a href="#" data-toggle="modal" data-target="#policy_1"
                             class="btn-link quest-text">제3자 개인정보 동의 약관</a>과
                          <a href="#" data-toggle="modal" data-target="#policy_3"
                             class="btn-link quest-text">웹사이트 이용약관</a>,
                          <a href="#" data-toggle="modal" data-target="#policy_2"
                             class="btn-link quest-text">동아리 회칙</a>에 동의합니다.</label>
                      </div>
                      <div class="form-group item_flex_btn_center m-b0">
                        <input type="checkbox" id="interview_policy" required="required"
                               onclick="alert('빠른 시일 내에 면접을 위해 연락드리겠습니다.')"/>
                        <label for="interview_policy">
                          본인은 면접을 보는 것에 동의합니다.
                        </label>
                      </div>

                    </div>
                    <!-- 입부신청 버튼 -->

                    <div class="form-group item_flex_btn_center2 item-flex-end m-b0">
                      <input type="submit" class="site-button button-md width-150" value="입부신청"/>
                    </div>
                  </div>
                </div>
                <!-- 입부신청 작성란  -->

            </div>
          </div>
        </div>

        <!-- 화면 오른쪽에 있는 글자.  -->
        <div class="item_flex_bg">
          <img style="height: 100%; width: 100%" src= '../../assets/images/blue-purple-technology-circuit.jpg' alt="">
        </div>
      </div>
    </div>
    <button class="scroltop fa fa-chevron-up"></button>
  </div>
</template>

<script>
export default {
  name: "Quest.vue"
}
</script>

<style scoped>

</style>