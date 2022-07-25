<template>

  <div class="page-content bg-white">
    <div class="content-block min-height-70vh">
      <div class="section-full content-inner bg-white" style="padding-top: 50px">
        <div class="container-layout">
            <div class="row" style="justify-content: center">
              <div class="col-lg-8 col-xl-8 p-b30">
                <div class="blog-post blog-single">
                  <!-- 게시글 작성자 및 작성시간을 담는 div -->
                  <div class="dlab-post-meta m-b20">
                    <ul class="d-flex align-items-center">
                      <!-- 게시글 작성자 -->

                      <li class="post-author"><i class="bi bi-person"></i>By <a
                          href="javascript:void(0);">{{writerName}}</a>
                      </li>
                      <!-- 게시글 작성시간 -->
                      <li class="post-comment"><i class="ti ti-alarm-clock"></i> <a
                          href="javascript:void(0);">{{dateTime(created)}}</a>
<!--                        {{moment().format('YYYY-MM-DD')}}-->
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
<!--                    <div class="download-box">-->
<!--&lt;!&ndash;                      {% for board_file in file_list %}&ndash;&gt;-->
<!--                      &lt;!&ndash; 첨부파일 1 &ndash;&gt;-->
<!--                      <i class="fa fa-download m-r15 "></i><a class="line2 text-textColor font-medium" download-->
<!--                                                               href="#">파일이름</a>-->
<!--                      &lt;!&ndash; 파일 간 구분선 마지막 파일은 구분선을 출력하지 않도록 설정.&ndash;&gt;-->
<!--&lt;!&ndash;                      {% if forloop.revcounter0 != 0 %}&ndash;&gt;-->
<!--                      <div class="dlab-divider tb10 bg-gray-dark"></div>-->
<!--&lt;!&ndash;                      {% endif %}&ndash;&gt;-->
<!--&lt;!&ndash;                      {% endfor %}&ndash;&gt;-->
<!--                    </div>-->
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
                    <button class="site-button radius-xl m-l10 bg-bgColor hover:bg-bgColorHo focus:bg-bgColor"
                            @click="modify">
                      <i class="fa fa-pencil m-r5"></i>게시글 수정
                    </button>
                    <!-- 게시글 삭제 버튼 -->
                    <!-- 관련자만 보이게 처리 -->

                    <button class="site-button red radius-xl m-l10" @click="delete_board">
<!--                            onclick="goPage('{% url '#' board_no=board.board_no %}', true, '게시글은 삭제되면 복구가 불가능합니다.\n정말 삭제하시겠습니까?')">-->
                      <i class="fa fa-trash m-r5"></i>게시글 삭제
                    </button>


                  </div>
                </div>
                <!--==================== 댓글부분 시작 ====================-->
<!--                <comment-list></comment-list>-->
                <!--==================== 댓글부분 끝 ====================-->
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
// import CommentList from "@/board/pages/CommentList";


export default {

  data(){
    return{
      id:this.$route.params.id,
      title:'',
      contents:'',
      menuId:'',
      writerName:'',
      created:'',
    }
  },

  methods:{
    delete_board() {
      if (confirm("게시글은 삭제되면 복구가 불가능합니다.\n정말 삭제하시겠습니까?")) {
        axios.delete('/api/board/' + this.id)
            .then(() => {
              alert("삭제되었습니다.");
              this.$router.go(-1)
            })
            .catch((err) => {
              alert("삭제를 실패하였습니다.")
              console.log(err);
            })
      }
    },
    modify()
    {
      this.$router.push({path:"../register",query:{id:this.$route.params.id}});
    },
    dateTime(value){
      return moment(value).format('YYYY-MM-DD hh:mm');
    }
  },



  created(){
    axios.get('/api/board/'+ this.id )
        .then(response => {
          this.id = response.data.id;
          this.title=response.data.title;
          this.contents = response.data.contents;
          this.writerName = response.data.writer_name;
          this.menuId=response.data.menu_id;
          this.created = response.data.created;
          this.updated = response.data.updated;
          console.log(response)
        })
        .catch(error => console.log(error));
  },

  name: "Board_Detail",
}
</script>

<style scoped>
h2{
  font-size: 30px;
}
</style>