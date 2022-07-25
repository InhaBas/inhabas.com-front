<template>
  <div class="page-wraper">
    <!--====================메뉴바 시작====================-->
    <TopBar></TopBar>
    <!--====================메뉴바 끝====================-->
    <!-- 상단 제목부분 -->
    <div class="page-content bg-white">
      <!----------============= 상단 제목 시작 ================----------->
      <HeaderTitle :menuId="menuId"></HeaderTitle>
      <!----------============= 본문 시작 ================----------->
      <div class="content-block min-height-70vh">
        <div class="section-full content-inner bg-white">
          <div class="container-layout">
            <div class="row">
              <!--========== 왼쪽 검색창 및 네비게이션 시작 ==========-->
              <div class="col-lg-3 col-xl-3">
                <div class="sticky-top">
                  <BoardSearch></BoardSearch>
                  <BoardNavi></BoardNavi>
                </div>
              </div>
              <!--========== 오른쪽 공모전 게시글 리스트 부분 시작 ===========-->
              <div class="col-lg-10 col-xl-8 p-b30">
                <div class="row">

                  <!--================= 여기부터 게시글 반복시작 =================-->
                  <!-- 게시글 1 -->
                  <div class="col-lg-4" v-for="contest in contests" :key="contest.name">
                    <div class="listing-bx event-listing m-b10">
                      <!-- 게시글 대표 이미지 div -->
                      <div class="listing-media">
                        <!-- 이미지를 클릭하면, 해당 게시글로 이동함 -->
                        <router-link to="/contestBoard/detail">

                          <img :src= "contest.img"
                               alt="이미지를 표시할 수 없습니다." style=" height:242px;"/>
                        </router-link>
                      </div>
                      <!-- 공모전 내용 간단소개 div -->
                      <div class="listing-info" style="height: 110px">
                        <!-- 공모전 제목 -->
                        <h3 class="title"><a
                            href="{% url 'contest_detail' contest.contest_no %}">{{ contest.name }}</a>
                        </h3>
                        <!-- 공모전 간단소개 -->
                        <ul class="event-meta">
                          <!-- 마감일 및 모집 상태 -->
                          <li class="event-date text-center">
                            <!-- 공모전 마감일 -->
                            <!-- 마감 월 (영어로 표기됨) -->
                            <span class="text-textColor">8 월</span>
                            <!-- 마감일 -->
                            <strong>22</strong>
                            <!-- 모집 및 마감 상태 -->
                            <!-- 공모전 기간 중에 있으면 모집이라고 뜨고, 공모전 기간이 자나면, 자동으로 마감으로 뜨게 처리 -->

                            <span class="recruiting">모 집</span></li>

<!--                          <span class="recruiting-end">마 감</span></li>-->

                          <!-- 공모전에 대한 간단소개 -->
                          <li class="text-cut">
                            이중 분야 개인데이터 융·복합 마이데이터 서비스 기획
                          </li>
                        </ul>
                      </div>
                      <div class="event-bottom">
                        <ul>
                          <!-- 공모전 기간 -->
                          <li class="event-hosted">
                            <span class="text-textColor mr-3">기간</span>
                            <span> 2021.07.14 ~ 2021.08.17 </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!--================= 여기부터 게시글 반복 끝 =================-->

                    <div style="text-align: center">게시글이 존재하지 않습니다.</div>


                </div>

                <div class="extra-cell text-right m-t20">
                  <!-- 게시글 등록 버튼 -->
                  <button type="submit" class="site-button radius-xl m-l10 bg-bgColor hover:bg-bgColor">
                    <router-link to="/contestBoard/register" class="text-white text-decoration-none">
                      <i class="fa fa-plus m-r5"></i>게시글 등록
                    </router-link>
                  </button>
                </div>

                <!--========== 페이지네이션 시작 ===========-->
                <!-- 1페이지에 6~8개 게시글 끌고오고, 게시글이 그보다 적으면, 페이지네이션 안보이게 처리 -->
                <Pagination></Pagination>
                <!--========== 페이지네이션 끝 ===========-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Footer 하단바 시작 -->
  <FooterBar></FooterBar>
  <!-- Footer END-->
  <!-- 상단으로 한번에 올라가는 버튼 -->
  <button class="scroltop fa fa-chevron-up" style="display: none;"></button>
</template>

<script>
import BoardSearch from "../components/BoardSearch"
import BoardNavi from "../components/BoardNavi"
import Pagination from "../../common/ThePagination";
import HeaderTitle from "../../common/TheHeaderTitle";
import TopBar from "@/common/Header";
import FooterBar from "@/common/Footer";

export default {
  name: "ContestBoard.vue",
  components: {BoardNavi, BoardSearch, Pagination, HeaderTitle,TopBar,FooterBar},
  data() {
    return {
      menuId:this.$route.params.id,
      contests: [
        {
          name: "contest1",
          img:
              "https://cdn.inhabas.com/images/test.jpeg"
        },
        {
          name: "contest2",
          img:
              "https://cdn.inhabas.com/images/test.jpeg"
        },
        {
          name: "contest3",
          img:
              "https://cdn.inhabas.com/images/test.jpeg"
        },
        {
          name: "contest4",
          img:
              "https://cdn.inhabas.com/images/test.jpeg"
        }
      ]
    };
  }
}
</script>

<style scoped>

</style>