<template>

  <div class="page-content bg-white">
    <div class="content-block min-height-70vh">
      <div class="section-full content-inner bg-white" style="padding-top: 50px">
        <div class="container-layout">
          <div class="row">
            <!--========== 왼쪽 검색창 및 네비게이션 시작 ==========-->
            <div class="col-lg-3 col-xl-3">
              <div class="sticky-top">
                <BoardSearch></BoardSearch>
                <BoardNavi></BoardNavi>
              </div>
            </div>

            <!--========== 오른쪽 게시글 리스트 부분 시작 ===========-->
            <div class="col-lg-10 col-xl-8 p-b30">
              <!-- 게시글을 담는 테이블 -->
              <table class="table table-hover">
                <!-- 테이블의 제목(1행) -->
                <thead>
                <tr>
                  <th scope="col">no.</th>
                  <th scope="col" style="width: 500px">제목</th>
                  <th scope="col" class="width-120">작성자</th>
                  <th scope="col" class="dis-none-media width-130">작성일</th>
                </tr>
                </thead>
                <!-- 끌고오는 게시글 파트 -->
                <tbody>
                <!-- 게시글 출력부 -->

                <tr
                    v-for="(item,idx) in listData"
                    :key="`ct-content-${idx}`">
                  <!-- 게시글 번호 -->
                  <th scope="row">{{item.id}}</th>
                  <!-- 게시글 제목 -->
                  <!-- 게시글 제목 클릭 시 해당 게시글의 상세 페이지로 이동하며, 제목을 a태크 처리함 -->
                  <td>

                    <router-link :to="`/list/${this.menuId}/detail/${item.id}`" class="text-decoration-none text-textColor">{{item.title}}</router-link>
<!--                    <router-link :to="{ name: 'BoardDetail', params: { boardId : item.id }}" class="text-decoration-none text-textColor">{{item.title}}</router-link>-->

                  </td>
                  <!-- 게시글 작성자 -->
                  <td>{{item.writer_name}}</td>
                  <!-- 게시글 작성일자 -->
                  <td class="dis-none-media">{{dateTime(item.created)}}</td>
                </tr>
                </tbody>
              </table>

              <div class="extra-cell text-right m-t20">
                <!-- 게시글 등록 버튼 -->
                <!-- 관련자만 보이게 처리 -->
                <button type="submit" class="site-button radius-xl m-l10 bg-bgColor hover:bg-bgColorHo focus:bg-bgColor">
                  <router-link :to="`/list/${this.menuId}/register/`" class="text-white text-decoration-none">
                    <i class="fa fa-plus m-r5"></i>게시글 등록
                  </router-link>
                </button>
              </div>



              <!--========== 페이지네이션 시작 ===========-->
              <Pagination
                  v-if="totalPages > 0"
                  :pageSetting="pageDataSetting(block, this.pageNumber)"
                  @paging="pagingMethod"
                  @change-page="changePage"
                  ></Pagination>
              <!--========== 페이지네이션 시작 ===========-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Footer 하단바 시작 -->
  <!-- Footer END-->


</template>

<script>
import BoardSearch from "../components/BoardSearch"
import BoardNavi from "../components/BoardNavi"
import Pagination from "../../common/ThePagination";
import axios from "axios";
import moment from 'moment';

export default {
  data(){
    return{
      menuId:this.$route.params.menuId,
      pageNumber: 0,
      listData:[],
      content:[],
      totalPages: 0,
      block: 5,
      first: false,
      last: false,
      // page: 0
    };
  },
  methods:{
    changePage: function (page){
      this.$router.push({name: 'Board', query: {page: page}})
    },

    dateTime(value){
      return moment(value).format('YYYY-MM-DD');
    },
    pagingMethod(pageNumber) {
      this.pageNumber = pageNumber
      this.pageDataSetting(this.pageCount, this.pageNumber)


    },

    pageDataSetting(block, page) {
      let currentPage = page

      const first =
          this.first === false ? parseInt(currentPage, 10) - parseInt(1, 10) : null
      const end =
          this.last === false
              ? parseInt(currentPage, 10) + parseInt(1, 10)
              : null

      let startIndex = (Math.ceil(currentPage / block) - 1) * block + 1
      let endIndex =
          startIndex + block > this.totalPages ? this.totalPages : startIndex + block - 1
      let list = []

      // console.log(currentPage)
      for (let index = startIndex; index <= endIndex; index++) {
        list.push(index)
      }
      return { first, end, list, currentPage }

    }
  },

  created(){
    console.log(this.menuId)
    let pageParam = new URL(location.href).searchParams.get('page')
    axios.get('/api/boards?menu_id='+this.menuId,{
    // axios.get('/api/budget/history/search', {
      params: {
        page: pageParam
      },

    })
      .then(response => {
        this.content = response.data.content;
        this.listData = response.data.content;
        this.totalPages = response.data.total_pages;
        this.first = response.data.first;
        this.last = response.data.last;
        this.pageNumber = response.data.pageable.page_number + 1;
        console.log(response.data)
        })
      .catch(error => console.log(error));
  },
  mounted() {
    this.pagingMethod(this.pageNumber)



  },
  name: "Board.vue",
  components: {BoardNavi, BoardSearch, Pagination},
}
</script>

<style>

</style>