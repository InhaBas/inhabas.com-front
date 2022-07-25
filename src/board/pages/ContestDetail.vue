<template>
  <div class="page-wraper">
    <div class="page-content bg-white">
      <div class="page-content bg-white ">
        <!----------============= 상단 제목 시작 ================----------->
        <HeaderTitle></HeaderTitle>
        <!----------============= 본문 시작 ================----------->
        <div class="section-full content-inner">
          <div class="container-layout">
            <div class="row" style="justify-content: center">
              <div class="col-lg-8 col-xl-8 p-b30">
                <div class="blog-post blog-single">
                  <!-- 게시글 작성자 및 작성시간을 담는 div -->
                  <div class="dlab-post-meta m-b20">
                    <ul class="d-flex align-items-center">
                      <!-- 게시글 작성자 -->
                      <li class="post-author"><i class="ti ti-user"></i>By <a
                          href="javascript:void(0);">윤예진</a>
                      </li>
                      <!-- 게시글 작성시간 -->
                      <li class="post-comment"><i class="ti ti-alarm-clock"></i> <a
                          href="javascript:void(0);">2022-01-16 13:33</a>
                      </li>
                    </ul>
                  </div>
                  <!-- 게시글 제목 -->
                  <div class="dlab-post-title ">
                    <h2 class="word-break-all post-title m-t0 font-bold">
                      게시글제목
                    </h2>
                  </div>
                  <!-- 공모전 주체기관 및 공모전 기간을 담는 div -->
                  <div class="dlab-post-meta m-b20">
                    <ul class="d-flex align-items-center">
                      <!-- 공모전 주체기관 -->
                      <li class="post-author"><i class="ti ti-home"></i><a
                          href="javascript:void(0);">인하대학교</a></li>
                      <!-- 공모전 기간 -->
                      <li class="post-comment"><i class="ti ti-calendar"></i> <a
                          href="javascript:void(0);">2021-07-14 ~ 2021-08-17</a></li>
                    </ul>
                  </div>
                  <!--============================== 게시글 본문 시작 ==============================-->
                  <div class="post-context word-break-all dlab-post-text">

                    <!--공모전 주제-->
                    <div class="dlab-divider bg-gray-dark" style="margin-bottom: 15px"></div>
                    <h5 style="text-align: center">공모전 주제</h5>
                    <div class="dlab-divider bg-gray-dark" style="margin-top: 0"></div>
                    <p class="word-break-all font-weight-300"
                       style="text-align: center">빅데이터</p>
                    <div class="dlab-divider bg-gray-dark"></div>

                    <!-- 포스터 나오는 곳 img파일은 이곳에 나오도록 -->
                    <!--                    {% for image in image_list %}-->
                    <img class="img-cover" src="#" alt=""/>
                    <!--                    {% endfor %}-->
                    <!--공모전 상세내용 나오는 곳-->
                    <p class="post-context font-weight-400"></p>
                    상세내용
                    <p class="font-weight-300"></p>

                    <!-- 본문 입력 내용 -->
                    <p class="font-weight-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                      do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo amet
                      set for your cool happiness for lyour loyal city.</p>

                    <!-- 첨부된 파일 불러오는 곳 -->
                    <!-- download 쪽에 파일 경로 설정 -->
                    <!-- 파일 리스트 길이가 0이 아닐 경우에만 파일 리스트를 출력하게 함. -->
                    <div class="download-box">
                      <!-- 첨부파일 1 -->
                      <i class="fa fa-download m-r15 "></i><a class="line2 text-textColor font-medium" download
                                                              href="#">파일이름</a>
                      <!-- 파일 간 구분선 마지막 파일은 구분선을 출력하지 않도록 설정.-->

                      <div class="dlab-divider tb10 bg-gray-dark"></div>
                    </div>
                  </div>
                  <!-- 게시글 삭제 및 수정 div -->
                  <div class="extra-cell text-right">

                    <!-- 게시글 수정 버튼 -->
                    <!-- 관련자만 보이게 처리 -->
                    <button class="site-button radius-xl m-l10 bg: bg-bgColor"
                            onclick="location.href='#'">
                      <i class="fa fa-pencil m-r5"></i>게시글 수정
                    </button>
                    <!-- 게시글 삭제 버튼 -->
                    <!-- 관련자만 보이게 처리 -->

                    <button class="site-button red radius-xl m-l10">
                      <!--                            onclick="goPage('{% url '#' board_no=board.board_no %}', true, '게시글은 삭제되면 복구가 불가능합니다.\n정말 삭제하시겠습니까?')">-->
                      <i class="fa fa-trash m-r5"></i>게시글 삭제
                    </button>


                  </div>
                </div>
                <!--==================== 댓글부분 시작 ====================-->
                <div id="CommentList"></div>
                <!--==================== 댓글부분 끝 ====================-->
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "../../common/TheHeaderTitle";
export default {
  name: "ContestDetail",
  components: {HeaderTitle}

}
</script>

<style scoped>

</style>