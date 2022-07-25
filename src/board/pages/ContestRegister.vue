<template>

  <div class="page-wraper">
    <div class="page-content bg-white">
      <!----------============= 상단 제목 시작 ================----------->

      <HeaderTitle></HeaderTitle>

      <!--===============================================입력란=========================================================-->
      <div class="content-block">
        <div class="section-full content-inner bg-white">
          <div class="container-layout">
            <div class="content-box">

              <div class="content-header">
                <h3 class="title">
                  공모전 제목
                </h3>
              </div>

              <div class="content-body">
                <div class="form-group">
                  <input type="text" name="contest_title" placeholder="공모전 이름을 입력하세요." maxlength="100"
                         style="font-size: 25px; height: 70px;" class="form-control" required id="id_contest_title">
                </div>
              </div>
            </div>
            <div class="content-box">

              <div class="content-header">
                <h3 class="title">
                  공모전 주제
                </h3>
              </div>

              <div class="content-body">
                <div class="form-group">
                  <input type="text" name="contest_topic" placeholder="공모전 주제를 적어주세요." maxlength="500"
                         class="form-control"
                         required id="id_contest_topic">
                </div>
              </div>
            </div>
            <div class="content-box">

              <div class="content-header">
                <h3 class="title">
                  공모전 주최기관
                </h3>
              </div>

              <div class="content-body">
                <div class="form-group">
                  <input type="text" name="contest_asso" placeholder="주최기관을 입력하세요." maxlength="100" class="form-control"
                         required id="id_contest_asso">
                </div>
              </div>
            </div>
            <div class="content-box">

              <div class="content-header">
                <h3 class="title">
                  공모전 시작일
                </h3>
              </div>

              <div class="content-body">
                <div class="form-group">
                  <input type="date" name="contest_start" class="form-control" required id="id_contest_start">
                </div>
              </div>
            </div>
            <div class="content-box">

              <div class="content-header">
                <h3 class="title">
                  공모전 마감일
                </h3>
              </div>

              <div class="content-body">
                <div class="form-group">
                  <input type="date" name="contest_deadline" class="form-control" required id="id_contest_deadline">
                </div>
              </div>
            </div>


            <div class="content-box">

              <div class="content-header">
                <h3 class="title">
                  공모전 포스터 및 첨부파일 <span class="font-13 font-weight-normal" style="color:red;"> &nbsp;&nbsp;&nbsp; ※ 첨부파일에 사진 파일이 없을 시, 정상적으로 게시글이 등록되지 않습니다.</span>
                </h3>
              </div>


              <div class="content-body">
                <div class="form-group">
                  <!--            <input type="file" name="upload_file" multiple-->
                  <!--                   accept=".xlsx,.xls,image/*,.doc,.docx,video/*,.ppt,.pptx,.txt,.pdf,.py,.java,.zip"-->
                  <!--                   id="id_upload_file">-->
                  <drag-n-drop></drag-n-drop>
                </div>


              </div>

            </div>


            <div class="content-box editor">

              <div class="content-header">
                <h3 class="title">
                  공모전 상세 설명
                </h3>
              </div>

              <div class="content-body">
                <div class="form-group">
                    <textarea class="w-full border"></textarea>

                </div>
              </div>
            </div>
            <!--최초 글작성 시 나오는 버튼-->
            <div style="display: grid; justify-items: center">
              <input class="site-button btn-block button-md mt-10 bg: bg-bgColor" type="submit" style="width: 30%"
                     value="등록하기"
                     onclick="">
            </div>
            <div style="display: grid; justify-items: center">
              <input class="site-button btn-block button-md mt-10 bg: bg-info" type="submit" style="width: 30%"
                     value="수정하기"
                     onclick="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "../../common/TheHeaderTitle";
import DragNDrop from "@/common/TheDragNDrop";


export default {
  name: "ContestRegister.vue",
  components: {HeaderTitle, DragNDrop}
}
</script>

<style scoped>

</style>