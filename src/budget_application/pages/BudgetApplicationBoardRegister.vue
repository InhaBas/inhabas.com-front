<template>

  <div class="page-content bg-white">
    <div class="content-block min-height-70vh">
      <div class="section-full content-inner bg-white" style="padding-top: 50px">
        <div class="container-layout">
          <!--====================================제목 시작==============================================-->
          <div class="content-box">
            <!--게시글 작성자, 작성시간 나옴-->
            <div class="content-header">
              <h3 class="title font-bold">제목</h3>
            </div>
            <!--여기까지-->
            <div class="content-body">
              <input v-model="title" type="text" placeholder="제목을 입력하세요" maxlength="100" class="form-control text-lg budget-input">
            </div>
          </div>
          <!--====================================제목끝=============================================-->
          <!--====================================지출 날짜 시작==============================================-->
          <div class="content-box">
            <div class="content-header">
              <h3 class="title font-bold">지출날짜</h3>
            </div>
            <div class="content-body">
              <input v-model="dateUsed" type="date" name="bank_used" class="form-control budget-input" >
            </div>
          </div>
          <!--====================================지출 날짜 끝=============================================-->
          <!--====================================지출 내역 시작==============================================-->
          <div class="content-box">
            <div class="content-header">
              <h3 class="title font-bold">지출내역</h3>
            </div>
            <div class="content-body">
              <div class="form-group font-medium">
                <input v-model="details"  type="text" placeholder="지출 목적 및 사용 내역을 입력하세요." maxlength="300"
                       class="form-control budget-input">
              </div>
            </div>
          </div>
          <!--====================================지출내역 끝=============================================-->
          <!--====================================지출금액 시작==============================================-->
          <div class="content-box">
            <div class="content-header">
              <h3 class="title font-bold">지출금액</h3>
            </div>
            <div class="content-body">
              <div class="form-group font-medium">
                <input v-model="outcome"  type="number" placeholder="정확한 지출액을 입력하세요" class="form-control budget-input">
              </div>
            </div>
          </div>
          <!--====================================지출금액 끝=============================================-->
          <!--====================================입금계좌 시작==============================================-->
          <div class="content-box">
            <div class="content-header">
              <h3 class="title font-bold">입금받을 계좌</h3>
            </div>
            <div class="content-body">
              <div class="form-group font-medium">
                <input v-model="accounts" type="text" placeholder="은행명, 계좌번호, 예금주를 입력해주세요" maxlength="100"
                       class="form-control budget-input">
              </div>
            </div>
          </div>
          <!--====================================입금계좌 끝=============================================-->
          <!--====================================영수증 시작=============================================-->

          <!--====================================영수증 끝=============================================-->
          <div class="d-flex justify-content-center">
            <input v-if="!id" class="site-button btn-block button-md mt-10 hover:bg-bgColorHo bg-bgColor focus:bg-bgColor" type="submit" style="width: 30%"
                   value="신청하기"
                   @click="upload">
          </div>
          <div class="d-flex justify-content-center">
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
import axios from "axios";

export default {
  name: "BudgetApplicationBoardRegister.vue",

  data() {
    return {
      id: this.$route.query.application_id,
      title: '',
      details: '',
      dateUsed: '',
      outcome: '',
      accounts: '',
      status: '',
      rejectReason: '',
      now:'00:00:00'
    }
  },

  methods: {
    time(){
      var date = new Date()
      this.now = String(date.getHours()).padStart(2, "0") + ":"
          + String(date.getMinutes()).padStart(2, "0") + ":"
          + String(date.getSeconds()).padStart(2, "0");

      return this.now
    },

    upload() {
      if(!this.title){
        alert("제목을 입력해주세요");
        return;
      }
      if(!this.dateUsed) {
        alert("지출날짜를 입력해주세요");
        return;
      }
      if(!this.details) {
        alert("지출내역을 입력해주세요");
        return;
      }
      if(!this.outcome) {
        alert("지출금액 입력해주세요");
        return;
      }
      if(!this.accounts) {
        alert("입금받을 계좌를 입력해주세요");
        return;
      }
      this.form = {
        title:this.title,
        date_used:this.dateUsed + 'T' + this.time(),
        details:this.details,
        outcome:this.outcome,
        accounts:this.accounts,
      }
      console.log(this.form)
      axios.post('/api/budget/application', this.form)
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
      axios.get('/api/budget/application/' + this.id)
          .then((response)=>{
            console.log(response.data)
            this.title = response.data.title,
            this.dateUsed = response.data.date_used,
            this.details = response.data.details,
            this.outcome = response.data.outcome,
            this.accounts = response.data.accounts
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
      if(!this.dateUsed) {
        alert("지출날짜를 입력해주세요");
        return;
      }
      if(!this.details) {
        alert("지출내역을 입력해주세요");
        return;
      }
      if(!this.outcome) {
        alert("지출금액 입력해주세요");
        return;
      }
      if(!this.accounts) {
        alert("입금받을 계좌를 입력해주세요");
        return;
      }
      this.form ={
        title:this.title,
        date_used:this.dateUsed + 'T' + this.time(),
        details:this.details,
        outcome:this.outcome,
        accounts:this.accounts,
        application_id: this.id
      }
      axios.put('/api/budget/application',this.form)
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
.budget-input {
  border: 1px solid #e7e7ed;
  padding: 6px 30px 6px 15px;
  height: 45px;
  border-radius: 4px;
  color: #70778b;
  font-size: 15px;
}
</style>