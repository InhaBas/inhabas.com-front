<template>
  <div class="sticky-header main-bar-wraper navbar-expand-lg">
    <div class="main-bar clearfix">
      <div class="container clearfix">
        <!-- ====ibas 로고 들어가는 곳==== -->
        <div class="logo-header mostion">
          <!--드래그 안했을 때 나오는 로고/href 메이페이지 링크 연결해줘야 함-->
          <a href="#" class="logo-1">
            <img src="../assets/images/logo_white.png" style="margin-top: 4px; margin-bottom: 4px">
          </a>
          <!--밑으로 드래그 했을 때 나오는 로고/href 메이페이지 링크 연결해줘야 함-->
          <a href="#" class="logo-2">
            <img src="../assets/images/logo_puple.png" style="margin-top: 4px; margin-bottom: 4px">
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
              <a href="#">{{Id.groupName}}<i class="fa fa-chevron-down"></i></a>
              <ul class="sub-menu">
                <!-- 동아리 소개를 누를 경우 url로 넘어간다. -->
                <li v-for="boardname in menu[index].menuList" :key="boardname"><a :href="`/${boardname.type.toLowerCase()}/${boardname.id}`">{{boardname.name}}</a></li>
              </ul>
            </li>

            <!--====================취미모임 메뉴====================-->
            <!--                <li class="active" style="padding-top: 7px"><a-->
            <!--                    href="#">취미모임</a>-->
            <!--                </li>-->

            <!--====================로그인 여부에 따라 다르게 보이는 곳====================-->
            <!--====================로그인했을 때====================-->
            <!--                &lt;!&ndash;======로그아웃 버튼======&ndash;&gt;-->
            <!--                <li class="active" onclick="printConfirm('정말 로그아웃 하시겠습니까?')"-->
            <!--                style="padding-top: 7px; padding-right: 10px">-->
            <!--                &lt;!&ndash;아래 href에 로그아웃하는 거 들어가야 함&ndash;&gt;-->
            <!--                <a href="#" style="padding: 19px 0px 0px 15px">Log Out</a>-->
            <!--                <a class="ti-export dis-none-media" style="padding:15px 0px 14px 4px; transform: rotate(90deg)"></a>-->
            <!--                </li>-->
            <!--                &lt;!&ndash;======회원정보 뜨는 곳======&ndash;&gt;-->
            <!--                <li class="active dis-none-media">-->
            <!--                  &lt;!&ndash;아래 href에 마이페이지 링크 들어가야 함&ndash;&gt;-->
            <!--                  <a href="#" style="padding-right: 7px;">-->
            <!--                    &lt;!&ndash;==승인되지 않았을 때==&ndash;&gt;-->
            <!--                    <img src="../assets/images/favicon.png" width="35px" height="35px"-->
            <!--                         style=" border: 2px solid #ff3d3d; border-radius: 17.5px; margin-right: 3px; max-height: 35px; max-width: 35px; min-height: 35px; min-width: 35px"-->
            <!--                         alt="현재 브라우저에서 지원하지 않는 형식입니다.">-->
            <!--                    #님-->
            <!--                    <ul class="sub-menu" style="text-align: center; width: 300px">-->
            <!--                      <a>아직 가입이 승인되지 않았습니다.<br/> 모든 기능이 제한됩니다.</a>-->
            <!--                    </ul>-->
            <!--                    &lt;!&ndash;==승인되었을 때==&ndash;&gt;-->
            <!--                    <img src="../assets/images/favicon.png" width="35" height="35"-->
            <!--                         style=" border: 2px solid #ffbf00; border-radius: 17.5px; margin-right: 3px; max-height: 35px; max-width: 35px; min-height: 35px; min-width: 35px"-->
            <!--                         alt="현재 브라우저에서 지원하지 않는 형식입니다.">-->
            <!--                    #님-->
            <!--                    <ul class="sub-menu" style="text-align: center; width: 300px">-->
            <!--                      <a>회비를 납부하지 않은 상태입니다.<br/> 대부분의 기능이 제한됩니다. </a>-->
            <!--                    </ul>-->
            <!--                    <img src="../assets/images/favicon.png" width="35" height="35"-->
            <!--                         style=" border: 2px solid #3cff44; border-radius: 17.5px; margin-right: 3px; max-height: 35px; max-width: 35px; min-height: 35px; min-width: 35px"-->
            <!--                         class="bg-white"-->
            <!--                         alt="현재 브라우저에서 지원하지 않는 형식입니다.">-->
            <!--                    #님-->
            <!--                    <ul class="sub-menu" style="text-align: center; width: 300px">-->
            <!--                      <a>계정이 활성화 되어 있습니다.</a>-->
            <!--                    </ul>-->
            <!--                  </a>-->
            <!--                </li>-->
            <!--                &lt;!&ndash;=====알림 뜨는 부분======&ndash;&gt;-->
            <!--                <li class="active dropdown dropdown-btn dis-none-media" style="padding:4px; margin-left: -13px">-->
            <!--                  <a class="fa fa-bell site-button dropdown-toggle" style="padding-top: 22px"-->
            <!--                     id="dropdownMenuButton"-->
            <!--                     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
            <!--                    &lt;!&ndash;이거는 노란색 동그라미인데, 알림이 없으면 뜨지 않고, 알림이 있으면 뜨게해야 함&ndash;&gt;-->
            <!--                    <div style="height: 6px; width: 6px; background-color: #e8af00; border-radius: 3px; margin: -18px 0px 0px 12px; position: relative; z-index: 2"></div>-->
            <!--                  </a>-->
            <!--                  &lt;!&ndash;===종 버튼 누르면 아래가 뜸===&ndash;&gt;-->
            <!--                  &lt;!&ndash;===알림 가져오기===&ndash;&gt;-->
            <!--                  <div class="dropdown-menu alt-tran" aria-labelledby="dropdownMenuButton"-->
            <!--                       style="right: 20%; width: auto; border-radius: 0px; max-height: 300px; overflow: auto">-->
            <!--                    <a class="dropdown-item site-button-link" href="#"-->
            <!--                       style="text-align: center">-->
            <!--                      <span>표시할 알람이 없습니다</span></a>-->
            <!--                    <a class="dropdown-item site-button-link"-->
            <!--                       href="#">-->
            <!--                                                <span style="color: #848484; text-align: center">alarm</span></a>-->
            <!--                  </div>-->
            <!--                </li>-->
            <!--                &lt;!&ndash;====================로그인 하지 않았을 때====================&ndash;&gt;-->
            <li class="active" style="padding-top: 5px;">
              <a href="Login" style="padding: 19px 0px 0px 15px">Log In</a>
              <a href="Login" class="ti-import rotate90 dis-none-media" style="padding:11px 2px 14px 3px;"></a>
            </li>
          </ul>
        </div>
        <!--====================메뉴바, 회원정보에 따른 버튼 끝====================-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data()
  {
    return{
      menu:[],
    }
  },
  created() {
    axios.get('https://dev.inhabas.com/api/menu/all')
        .then(response => {
          this.menu=response.data;
          console.log(response)})
        .catch(error => console.log(error));
  },
  name: "TopBar.vue"
}
</script>

<style scoped>

</style>