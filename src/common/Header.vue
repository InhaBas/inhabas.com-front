<template>
  <header class="site-header header-transparent mo-left">
    <div id="setIsFixed" class="sticky-header main-bar-wraper navbar-expand-lg">
      <div class="main-bar clearfix">
        <div class="container clearfix">
          <!-- ====ibas 로고 들어가는 곳==== -->
          <div class="logo-header mostion">
            <!--드래그 안했을 때 나오는 로고/href 메이페이지 링크 연결해줘야 함-->
            <a href="#" class="logo-1">
              <img src="../assets/images/logo_white.png" style="margin-top: 4px; margin-bottom: 4px" alt="현재 브라우저에서 지원하지 않는 형식입니다.">
            </a>
            <!--밑으로 드래그 했을 때 나오는 로고/href 메이페이지 링크 연결해줘야 함-->
            <a href="#" class="logo-2">
              <img src="../assets/images/logo_puple.png" style="margin-top: 4px; margin-bottom: 4px" alt="현재 브라우저에서 지원하지 않는 형식입니다.">
            </a>
          </div>
          <!-- nav toggle button -->
          <button class="navbar-toggler collapsed navicon justify-content-end" type="button"
                  data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown"
                  aria-expanded="false" aria-label="Toggle navigation">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <!--====================메뉴, 회원정보에 따른 버튼 시작====================-->
          <div class="header-nav navbar-collapse collapse justify-content-end" id="navbarNavDropdown">
            <ul class="nav navbar-nav">
              <!--====================IBAS 상위메뉴로 가지고 있는 메뉴====================-->
              <li v-for="(Id,index) in menu" :key="Id" class="down active" style="margin-top: 6px">
                <a href="#">{{Id.group_name}}<i class="fa fa-chevron-down"></i></a>
                <ul class="sub-menu">
                  <!-- 동아리 소개를 누를 경우 url로 넘어간다. -->
                  <li v-for="menuName in menu[index].menu_list" :key="menuName">
                    <router-link :to="`/${menuName.type.toLowerCase()}/${menuName.menu_id}`">{{menuName.name}}</router-link>
                  </li>
                </ul>
              </li>

              <li class="active" style="padding-top: 5px;">
                <router-link to="/login" style="padding: 19px 0 0 15px">Log In</router-link>
                <router-link to="/login" class="ti-import rotate90 dis-none-media" style="padding:11px 2px 14px 3px;"></router-link>
              </li>
            </ul>
          </div>
          <!--====================메뉴바, 회원정보에 따른 버튼 끝====================-->
        </div>
      </div>
    </div>
  </header>
</template>

<script>

import axios from "axios";

export default {
  data()
  {
    return{
      menu:[],
      page:0,
    }
  },
  created() {
    axios.get('/api/menus')
        .then(response => {
          this.menu=response.data;
          console.log(response)})
        .catch(error => console.log(error));

    window.addEventListener('scroll', this.isFixed);
  },

  methods: {
    isFixed() {
      var setIsFixed = document.getElementById("setIsFixed")
      if (window.scrollY > 0) {
        setIsFixed.classList.add('is-fixed')
      } else {
        setIsFixed.classList.remove('is-fixed')
        // console.log(setIsFixed.classList)
      }
    }
  },

  name: "Header.vue"
}

</script>

<style scoped>

</style>