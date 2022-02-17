<template>
  <div class="page-wraper">
    <div class="page-content bg-white">
      <div class="page-content bg-white ">
        <!----------============= 상단 제목 시작 ================----------->
        <HeaderTitle></HeaderTitle>
        <!----------============= 본문 시작 ================----------->
        <div class="section-full content-inner">
          <div class="container">
            <div class="row" style="justify-content: center">
              <div class="col-lg-8 col-xl-8 p-b30">
                <div class="blog-post blog-single">
                  <!-- 게시글 작성자 및 작성시간을 담는 div -->
                  <div class="dlab-post-meta m-b20">
                    <ul class="d-flex align-items-center">
                      <!-- 게시글 작성자 -->
                      <li class="post-author"><i class="ti ti-user"></i>By <a
                          href="javascript:void(0);">{{writerName}}</a>
                      </li>
                      <!-- 게시글 작성시간 -->
                      <li class="post-comment"><i class="ti ti-alarm-clock"></i> <a
                          href="javascript:void(0);">{{created}}</a>
                      </li>
                    </ul>
                  </div>
                  <!-- 게시글 제목 -->
                  <div class="dlab-post-title ">
                    <h2 class="word-break-all post-title m-t0 font-bold">
                      {{title}}
                    </h2>
                  </div>

                  <!--============================== 게시글 본문 시작 ==============================-->
                  <div class="post-context word-break-all dlab-post-text">

                    <!-- 본문 입력 내용 -->
                    <p class="font-weight-400 txt_cont" v-html="contents"></p>

<!--                    {{ board.board_cont|safe }}-->

                    <!-- 첨부된 파일 불러오는 곳 -->
                    <!-- download 쪽에 파일 경로 설정 -->
                    <!-- 파일 리스트 길이가 0이 아닐 경우에만 파일 리스트를 출력하게 함. -->
<!--                    {% if file_list %}-->
                    <div class="download-box">
<!--                      {% for board_file in file_list %}-->
                      <!-- 첨부파일 1 -->
                      <i class="fa fa-download m-r15 "></i><a class="line2 text-textColor font-medium" download
                                                               href="#">파일이름</a>
                      <!-- 파일 간 구분선 마지막 파일은 구분선을 출력하지 않도록 설정.-->
<!--                      {% if forloop.revcounter0 != 0 %}-->
                      <div class="dlab-divider tb10 bg-gray-dark"></div>
<!--                      {% endif %}-->
<!--                      {% endfor %}-->
                    </div>
<!--                    {% endif %}-->
                    <!-- 게시글 속 사진 모음 -->
                    <div class="widget widget_gallery gallery-grid-4 lightgallery">
<!--                      <ul>-->
<!--&lt;!&ndash;                        {% for board_img in img_list %}&ndash;&gt;-->
<!--&lt;!&ndash;                        {% if forloop.counter < 4 %}&ndash;&gt;-->
<!--                        <li>-->
<!--                                                            <span data-exthumbimage="#"-->
<!--                                                                  data-src="#"-->
<!--                                                                  class="check-km "-->
<!--                                                                  title="">-->
<!--                                                                <a href="javascript:void(0);">-->
<!--                                                                    <div class="dlab-post-thum act-detail-img-size">-->
<!--                                                                        <img style="height: 190px"-->
<!--                                                                             src="#"-->
<!--                                                                             alt=""/>-->
<!--                                                                    </div>-->
<!--                                                                </a>-->
<!--                                                            </span>-->
<!--                        </li>-->
<!--&lt;!&ndash;                        {% elif forloop.counter == 4 %}&ndash;&gt;-->
<!--                        <li>-->
<!--                                                            <span data-exthumbimage="#"-->
<!--                                                                  data-src="#"-->
<!--                                                                  class="check-km act-detail-img-siz"-->
<!--                                                                  title="ㅎㅇ">-->
<!--                                                                <a href="javascript:void(0);">-->
<!--                                                                    <div class="dlab-post-thum "><img-->
<!--                                                                        style="height: 190px"-->
<!--                                                                        src="#"-->
<!--                                                                        alt=""></div>-->
<!--                                                                  &lt;!&ndash; 사용자가 업로드한 사진이 딱 4개인 경우 남은 이미지 개수를 출력하지 않음.&ndash;&gt;-->
<!--                                                                        <div class="more-images">-->
<!--                                                                            <div>-->
<!--                                                                                <strong>ㅎㅇ</strong>-->
<!--                                                                                <span>More Images</span>-->
<!--                                                                            </div>-->
<!--                                                                        </div>-->

<!--                                                                </a>-->
<!--                                                            </span>-->
<!--                        </li>-->

<!--                        <li style="display: none;">-->
<!--                                                            <span data-exthumbimage="#"-->
<!--                                                                  data-src="#"-->
<!--                                                                  class="check-km "-->
<!--                                                                  title="#">-->
<!--                                                                <a href="javascript:void(0);">-->
<!--                                                                    <div class="dlab-post-thum act-detail-img-size">-->
<!--                                                                        <img style="height: 190px"-->
<!--                                                                             src="#"-->
<!--                                                                             alt=""/>-->
<!--                                                                    </div>-->
<!--                                                                </a>-->
<!--                                                            </span>-->
<!--                        </li>-->

<!--                      </ul>-->
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
import axios from "axios";

export default {
  data(){
    return{
      id:'',
      title:'',
      contents:'',
      writerName:'',
      menuId:'',
      created:'',
    }
  },

  methods:{
    fetchData(boardid)
    {
      axios.get('https://dev.inhabas.com/api/board?id='+boardid)
          .then(response => {
            this.id = response.data.id;
            this.title=response.data.title;
            this.contents = response.data.contents;
            this.writerName = response.data.writerName;
            this.menuId = response.data.menuId;
            this.created = response.data.created;
            this.updated = response.data.updated;
            console.log(response)
          })
          .catch(error => console.log(error));
    }
  },

  // setup()
  // {
  //   const deleteBoard = async () => {
  //     try {
  //       await axios.delete(this.id)
  //       console.log("게시물 삭제를 성공하였습니다.");
  //     }catch(e){
  //       console.log("게시물 삭제를 실패하였습니다.");
  //     }
  //   };
  // },


  created(){
    const boardid = this.$route.params.id;
    this.fetchData(boardid);
    console.log()
  },
  name: "Board_Detail",
  components: {HeaderTitle},
}
</script>

<style scoped>

</style>