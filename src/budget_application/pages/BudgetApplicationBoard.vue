<template>
  <div class="page-content bg-white">
    <div class="content-block min-height-70vh">
      <div class="section-full content-inner bg-white" style="padding-top: 50px">
        <div class="container-layout">

          <!--필터 == 전체보기, 승인대기, 승인완료, 승인거절 중 선택-->
            <div class="d-flex">
              <div class="mr-auto">
                <ul class="m-b0">
                  <li>
                    <select class="list-filter">
                      <option>전체보기</option>
                      <option>승인대기</option>
                      <option>승인완료</option>
                      <option>승인거절</option>
                    </select>
                  </li>
                </ul>
              </div>
          </div>


          <div class="row">
            <!--========== 오른쪽 게시글 리스트 부분 시작 ===========-->
            <!-- 게시글을 담는 테이블 -->
            <table class="table table-hover">
              <!-- 테이블의 제목(1행) -->
              <thead>
              <tr>
                <th scope="col" style="text-align: center">no.</th>
                <th scope="col" style="width: 500px; text-align: center">제목</th>
                <th class="dis-none-media" scope="col" style="text-align: center">작성자</th>
                <th class="dis-none-media" scope="col" style="text-align: center">작성일</th>
                <th scope="col" style="text-align: center; width: 160px">상태</th>
              </tr>
              </thead>
              <!-- 끌고오는 게시글 파트 -->
              <tbody>
                <tr
                    v-for="(item,idx) in listData"
                    :key="`ct-content-${idx}`">
                  <!-- 게시글 번호 -->
                  <th scope="row" class="text-center">{{item.application_id}}</th>
                  <!-- 게시글 제목 -->
                  <!-- 게시글 제목 클릭 시 해당 게시글의 상세 페이지로 이동하며, 제목을 a태크 처리함 -->
                  <td>

                    <router-link :to="`/budget_support/${this.menuId}/detail/${item.application_id}`" class="text-decoration-none text-textColor">{{item.title}}</router-link>
                    <!--                    <router-link :to="{ name: 'BoardDetail', params: { boardId : item.id }}" class="text-decoration-none text-textColor">{{item.title}}</router-link>-->

                  </td>
                  <!-- 게시글 작성자 -->
                  <td class="text-center">{{item.applicant_name}}</td>
                  <!-- 게시글 작성일자 -->
                  <td class="dis-none-media text-center">{{dateTime(item.date_created)}}</td>
                  <td v-if="item.status === 'WAITING'" class="bank_yet">승인 대기</td>
                  <td v-else-if="item.status === 'APPROVED'" class="bank_pass">승인 완료</td>
                  <td v-else class="bank_nopass">승인 거절</td>
  <!--                <td class="bank_yet">{{item.status}}</td>-->
                </tr>
              </tbody>
            </table>
          </div>
          <!--신청하기 버튼, 누르면 작성페이지로 이동-->
          <div class="extra-cell text-right" style="margin: 20px 20px 0px 0px">
            <router-link :to="`/budget_support/${this.menuId}/register/`" class="site-button radius-xl m-l10 bg-bgColor hover:bg-bgColorHo focus:bg-bgColor">
              <i class="fa fa-plus m-r5"></i>
              신청하기
            </router-link>
          </div>

          <!--========== 페이지네이션 시작 ===========-->
          <Pagination
              v-if="totalPages > 0"
              :pageSetting="pageDataSetting(block, this.pageNumber)"
              @paging="pagingMethod"
              @change-page="changePage"
          ></Pagination>
          <!--========== 페이지네이션 끝 ===========-->

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Pagination from "@/common/ThePagination"
import moment from "moment";
import axios from "axios";


export default {
  name: "BudgetApplicationBoard.vue",
  components: { Pagination},

  data() {
    return {
      menuId:this.$route.params.menuId,
      pageNumber: 0,
      listData:[],
      content:[],
      totalPages: 0,
      block: 5,
      first: false,
      last: false,
    }
  },
  methods:{
    changePage: function (page){
      this.$router.push({name: 'BudgetApplicationBoard', query: {page: page}})
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
    let pageParam = new URL(location.href).searchParams.get('page')
      axios.get('/api/budget/applications', {
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
}
</script>

<style scoped>
.list-filter {
  padding: 0;
  color: #fff;
  font-size: 14px;
  line-height: 40px;
  background: #4611a7;
  border: none;
  border-radius: 30px;
  width: 100px;
  height: 40px;
  display: inline-block;
  text-align: center;
  }
</style>