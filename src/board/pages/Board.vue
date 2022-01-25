<template>
  <link rel="stylesheet" type="text/css" href="https://cdn.inhabas.com/css/posting_list.css">
  <link rel="stylesheet" type="text/css" href="https://cdn.inhabas.com/css/templete.min.css">
  <link rel="stylesheet" type="text/css" href="https://cdn.inhabas.com/css/ibas_contents.css">
  <link rel="stylesheet" type="text/css" href="https://cdn.inhabas.com/css/plugins.css">
  <div class="page-wraper">
    <!-- 상단 제목부분 -->
    <div class="page-content bg-white">
      <!----------============= 상단 제목 시작 ================----------->
      <HeaderTitle></HeaderTitle>
      <!----------============= 본문 시작 ================----------->
      <div class="content-block min-height-70vh">
        <div class="section-full content-inner bg-white">
          <div class="container">
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


                  <tr style="background-color: #fff7e4">
                    <!-- 게시글 번호 -->
                    <th scope="row"><i class="fa fa-thumb-tack" style="opacity:1; color: rgb(95 81 7);"></i></th>
                    <!-- 게시글 제목 -->
                    <!-- 게시글 제목 클릭 시 해당 게시글의 상세 페이지로 이동하며, 제목을 a태크 처리함 -->
                    <td>

                      <router-link to="/board/detail" class="text-decoration-none text-textColor">
                        <b>권한에 따른 웹사이트 이용 범위</b>
                      </router-link>

                    </td>
                    <!-- 게시글 작성자 -->
                    <td>양태영</td>
                    <!-- 게시글 작성일자 -->
                    <td class="dis-none-media">2021-08-16</td>
                  </tr>


                  <tr>
                    <!-- 게시글 번호 -->
                    <th scope="row">1</th>
                    <!-- 게시글 제목 -->
                    <!-- 게시글 제목 클릭 시 해당 게시글의 상세 페이지로 이동하며, 제목을 a태크 처리함 -->
                    <td>

                      <a class="text-decoration-none text-textColor">IBAS 현직자 특강 줌 링크 공유합니다!</a>

                    </td>
                    <!-- 게시글 작성자 -->
                    <td>강지훈</td>
                    <!-- 게시글 작성일자 -->
                    <td class="dis-none-media">2021-11-02</td>
                  </tr>




                  </tbody>
                </table>

                <div class="extra-cell text-right m-t20">
                  <!-- 게시글 등록 버튼 -->
                  <!-- 관련자만 보이게 처리 -->
                  <button type="submit" class="site-button radius-xl m-l10 bg-bgColor hover:bg-bgColorHo">
                    <router-link to="/board/register" class="text-white text-decoration-none">
                      <i class="fa fa-plus m-r5"></i>게시글 등록
                    </router-link>
                  </button>
                </div>

                <!--========== 페이지네이션 시작 ===========-->
                <!-- 1페이지에 15개 게시글 끌고오고, 게시글이 그보다 적으면, 페이지네이션 안보이게 처리 -->


                <!--========== 페이지네이션 시작 ===========-->
                <Paginations></Paginations>
                <!--========== 페이지네이션 끝 ===========-->

                <!--========== 페이지네이션 끝 ===========-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 상단으로 한번에 올라가는 버튼 -->
    <button class="scroltop fa fa-chevron-up" style="display: none;"></button>
  </div>

</template>

<script>
import BoardSearch from "../components/BoardSearch"
import BoardNavi from "../components/BoardNavi"
import Paginations from "../../common/ThePaginations";
import HeaderTitle from "../../common/TheHeaderTitle";

export default {
  name: "Board.vue",
  components: {BoardNavi, BoardSearch, Paginations, HeaderTitle}
}
</script>

<style>

</style>