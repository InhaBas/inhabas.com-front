<template>

  <div class="page-content bg-white">
    <div class="content-block min-height-70vh">
      <div class="section-full content-inner bg-white" style="padding-top: 50px">
        <div class="container-layout">

            <!--=====================-->
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
              <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path
                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </symbol>
            </svg>

            <div class="alert alert-primary d-flex align-items-center" role="alert"
                 style="background-color: white; border-color: #4015a0">
              <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img"
                   aria-label="Warning:" style="color: #4015a0">
                <use xlink:href="#exclamation-triangle-fill"/>
              </svg>
              <div class="ml-3" style="font-size: small; font-weight: bold; color: #4015a0">
                웹사이트 운영 정책을 위반하는 게시글은 예고 없이 삭제 될 수 있습니다.
              </div>
            </div>
            <!--=====================-->
            <div class="content-box editor">
              <!--글쓰기-->
              <div class="content-header">
                <h3 class="title d-inline-block font-bold">
                  게시글 작성&nbsp;&nbsp;&nbsp;&nbsp;</h3>
                  <!--                     {% if logined_user.user_role.role_no <= 4 and board_type_no != 2 and board_type_no != 9 %}-->
                  <div class="d-inline-block width-120 ">
                    <select name="board_fixdate">
                      <option value="0"> 상단 고정 여부</option>
                      <option value="2weeks">2주 고정</option>
                      <option value="permanent">영구 고정</option>
                    </select>
                  </div>
                  <!--                    {% endif %}-->

              </div>

              <div class="content-body">

                <!--제목 입력란-->
                <div class="form-group">
                  <input v-model="title" type="text" name="board_title" placeholder="제목을 입력하세요." maxlength="100"
                         style="font-size: 25px; height: 70px;" class="form-control" required="" id="id_board_title">
                  <!--                    {% render_field board_form.board_title class="form-control" style="font-size: 25px; height: 70px;" %}-->
                  <br/>

                  <!-- text editor -->


<!--                  <TheTextEditor></TheTextEditor>-->
                  <textarea class="txt_cont border-1 border-gray-300 w-full h-52 mb-3 rounded-2 " v-html="contents" v-model="contents"></textarea>


                  <drag-n-drop></drag-n-drop>

                </div>
                <!--이미지, 파일 업로드란-->
                <!-- 이미 존재하고 있던 이미지: 삭제 가능 (수정모드)-->
                <!--                  {% if board_no is not None %}-->
                <!--                  {% include "file_update_box.html" %}-->
                <!--                  {% endif %}-->
                <!--내용입력란-->
                <!--                  <div class="form-group">-->

                <!--                    {% render_field board_form.board_cont %}-->
                <!--                  </div>-->


                <!--test-->

              </div>
            </div>

            <!--=====================-->
            <!--등록하기 버튼, 누르면 게시글 상세보기로-->
            <!--최초 글작성 시 나오는 버튼-->
            <div style="display: grid; justify-items: center">
              <input v-if="!id" class="site-button btn-block button-md mt-10 hover:bg-bgColorHo bg-bgColor focus:bg-bgColor" type="submit" style="width: 30%"
                     value="등록하기"
                     @click="upload">
            </div>
            <div style="display: grid; justify-items: center">
              <input v-if="id" class="site-button btn-block button-md mt-10 hover:bg-bgColorHo bg-bgColor focus:bg-bgColor" type="submit" style="width: 30%"
                     value="수정하기"
                     @click="board_modify">
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
import DragNDrop from "@/common/TheDragNDrop";
import axios from "axios";
import {useCookies} from "vue3-cookies";
// import TheTextEditor from "@/common/TheTextEditor";


export default {
  name: "BoardRegister.vue",
  components: {
    // TheTextEditor,
    DragNDrop,
  },
  setup(){
    const { cookies } = useCookies();
    return { cookies };
  },

  data(){
    return{
      id:this.$route.query.id,
      title:'',
      contents:'',
      menuId:this.$route.params.menuId,
      loginedUser:'',
      form:{},
    }
  },
  methods:{
    upload() {
      if(!this.title){
        alert("제목을 입력해주세요");
        return;
      }
      if(!this.contents) {
        alert("내용을 입력해주세요");
        return;
      }
      this.form = {
        title:this.title,
        contents:this.contents,
        menu_id:this.menuId
      }
      console.log(this.form)
      axios.post('/api/board', this.form)
      .then(()=>{
        alert('등록 되었습니다');
        this.$router.go(-1)
      })
      .catch((err)=>{
        alert('등록에 실패하였습니다')
        console.log(err);
      })
    },

    view_title_contents()
    {
      axios.get('/api/board/' + this.id)
      .then((response)=>{
        this.title = response.data.title;
        this.contents = response.data.contents;
      })
      .catch((err)=>{
        console.log(err);
      })
    },
    board_modify()
    {
      if(!this.title){
        alert("제목을 입력해주세요");
        return;
      }
      if(!this.contents)
      {
        alert("내용을 입력해주세요");
        return;
      }
      this.form ={
        title:this.title,
        contents:this.contents,
        id:this.id,
      }
      axios.put('/api/board',this.form)
          .then(()=>{
            alert('수정 되었습니다');
            this.$router.go(-1)
          })
          .catch((err)=>{
            alert('수정에 실패하였습니다')
            console.log(err);
          })
    }
  },
  mounted()
  {
    if(this.id)
    {
      this.view_title_contents()
    }
  }
}
</script>

<style scoped>

</style>