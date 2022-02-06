<template>

  <!--  <div id="loading-area"></div>-->
  <div class="page-wraper">
    <!-- Content -->
    <div class="dlab-login"
         style="background-position: top right; background-blend-mode: screen">
      <div class="container-flex">
        <div class="item_flex_lgn login-form-box">
          <!-- 여기서부터 로그인 양식 시작  -->
          <!-- 세로로 길쭉한 컨테이너-->
          <div class="login-form form-position-center media-mt-50" style="left: -1%; padding-top: 15%">
            <!--길쭉한 컨테이너 속 컨텐츠 컨테이너-->
            <div class="join-frame">
              <!-- 동아리 로고  -->
              <div class="logo-container-flex">
                <!-- a 태그로 인해 동아리 로고 클릭하면 메인화면으로 감.  -->
                <a href="">
                  <div>
                    <img src='https://cdn.inhabas.com/images/IBAS_favicon.png' alt="현재 브라우저에서는 지원하지 않는 형식입니다."
                         width="150" height="150">
                  </div>
                </a>
              </div>

              <!-- 회원 가입 입력 폼 시작 -->
              <!-- 단답 작성란 시작 -->
              <div class="tab-content nav">
                <!--                   <div id="register" class="tab-pane fade"> -->
                <div id="register" class="tab-pane active">
                  <div class="hr-sect">기본정보</div>
                  <!--이름 input / 구글이나 네이버로부터 정보 받아옴-->
                  <div class="form-group mb-0">
                    <input
                        id="user_name"
                        type="text"
                        name="user_name"
                        value=""
                        placeholder="이름"
                        class="form-control"
                        maxlength="20"
                        required="required"
                    />
                  </div>
                  <p class="mb-1 mt-1" style="font-size: 8pt;color:red;line-height: 120%">
                    <i class="la la-check"></i>
                    &nbsp;학번이 학생 DB와 대조 후 일치하지 않을 시, 가입을 승인하지 않습니다.<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;실명과
                    학번이 맞는지 다시 한 번 확인해주세요.
                  </p>

                  <!--이메일은 수정하지 못하도록 고정 / 구글이나 네이버로부터 정보 받아옴-->
                  <!-- 안에 적힐 내용의 css는 form-control_instead에서 지정함.  -->
                  <div class="form-group form-control_instead" style="background-color: #bcbcbc">
                    <b>email</b>
                  </div>

                  <!-- 핸드폰 번호 input -->
                  <div class="form-group">
                    <input
                        id="user_phone"
                        type="tel"
                        name="user_phone"
                        class="form-control"
                        placeholder="핸드폰번호"
                        maxlength="13"
                        required="required"
                        onfocusout="phone_check('{% url 'join' %}')"
                        onkeyup="inputPhoneNumber(this)"
                    />
                  </div>
                  <p id="error_text_phone" class="error-text">입력한 핸드폰 번호가 중복됩니다.</p>
                  <!-- 학년, 학번 컨테이너 -->
                  <div class="form-container-flex m-b0">
                    <!--학년 컨테이너-->

                    <div class="form-group rounded-full height-45"
                         style="border: 1px solid #e7e7ed; padding: 10px 15px; color: #70778b">
                      <select id="user_grade" name="user_grade" required="required">
                        <option value="1">
                          1학년
                        </option>
                        <option value="2">
                          2학년
                        </option>
                        <option value="3">
                          3학년
                        </option>
                        <option value="4">
                          4학년 이상
                        </option>
                      </select>
                    </div>

                    <div class="form-group form-item-flex-std-no">
                      <input
                          id="user_stu"
                          type="number"
                          name="user_stu"
                          class="form-control"
                          required="required"
                          placeholder="학번"
                      />
                    </div>

                  </div>
                  <!-- 전공 input -->
                  <div class="form-container-flex form-group m-b0">
                    <div class="width-400">
                      <input
                          type="text"
                          id="user_major"
                          name="user_major"
                          placeholder="전공을 검색하려면 클릭하세요."
                          class="form-control_instead"
                          required="required"
                          readonly="readonly"
                          onclick="popUp()"
                      />
                    </div>
                    <!-- 전공 검색 버튼 -->
                    <div class="form-group" onclick="popUp()">
                      <i class="fa fa-search fa-2x form-item-flex-major-icon search-btn"></i>
                    </div>
                  </div>
                  <!-- 체크 박스, 동의 문구 컨테이너 -->
                  <div style="display: flex; flex-direction: column">
                    <!-- 개인정보 제공 동의 컨테이너 -->
                    <div class="form-group item_flex_btn_center mb-0">
                      <input type="checkbox" id="privacy-policy" required="required"/>
                      <label for="privacy-policy"
                      >본인은
                        <a href="/rule" data-toggle="modal" data-target="#policy_1"
                           class="btn-link quest-text">제3자 개인정보 동의 약관</a>과
                        <a href="#" data-toggle="modal" data-target="#policy_3"
                           class="btn-link quest-text">웹사이트 이용약관</a>,
                        <a href="#" data-toggle="modal" data-target="#policy_2"
                           class="btn-link quest-text">동아리 회칙</a>에 동의합니다.</label>
                    </div>
                  </div>
                  <!-- 입부신청 버튼 -->
                  <div class="form-group mt-5 mb-5">
                    <button class="site-button button-md w-full" onclick="location.href='/quest'">다음</button>
                  </div>
                </div>
              </div>
              <!-- 입부신청 작성란  -->
            </div>
          </div>
        </div>
        <!-- 오른쪽 이미지를 넣을 장소 시작 -->
        <div class="item_flex_bg">
          <img style="height: 100%; width: 100%" src="../../assets/images/blue-purple-technology-circuit.jpg" alt="">
        </div>
        <!--오른쪽 이미지 넣을 장소 끝-->
      </div>
    </div>
  </div>
  <div id="gray_shadow" class="gray_shadow" onclick="popDown()"></div>
  <!-- 전공 검색 팝업창 -->
  <div id="major-search-popup" class="card major-search-popup" style="width: 450px; display: none; position: absolute">
    <div class="card-header" style="display: flex; align-items: center; justify-content: space-between">
      <h4 class="m-b0"> 전공 검색 </h4>
      <!-- 닫기 버튼 -->
      <i class="fa fa-close fa-2x btn-exit" onclick="popDown()"></i>
    </div>
    <div class="card-body" style="display: flex; height: auto">

      <!-- 검색 영역 -->
      <div class="searchBox" style="width: 100%; margin-top: 20px; margin-left: 20px">
        <input class="form-control" type="text" id="search" onkeyup="filter()" placeholder="전공을 입력하세요"/>
      </div>
      <!-- 전공 리스트 영역 -->

      <div class="listBox" style="width: 100%; margin-left: 20px">
        <table class="table table-hover">
          <thead>
          <tr>
            <th>학교명</th>
            <th>단과대학</th>
            <th>학과명</th>
          </tr>
          </thead>
          <tbody>
          <!--전공 리스트를 단과대학, 학과명 순으로 가져옴-->
          <tr class="listInner" onclick="printResult(1)">
            <th>인하대학교</th>
            <td class="colleges">경영대학</td>
            <td id="major_name_1" class="major_names">경영학과</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>


</template>

<script>
export default {
  name: "Join.vue",
}
</script>

<style scoped>

</style>
