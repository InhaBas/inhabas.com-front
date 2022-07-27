<template>

  <div class="page-content bg-white">
    <div class="content-block min-height-70vh">
      <div class="section-full content-inner bg-white" style="padding-top: 50px">
        <div class="container-layout">
          <!--=====================-->
          <!--승인을 대기 중일 때 뜨는 알람-->
          <div v-if="this.status === 'WAITING'" class="alert alert-secondary" role="alert" style="text-align: center">
            <i>승인대기중</i>
          </div>
          <!--승인 완료 시 뜨는 알람-->
          <div v-else-if="this.status === 'APPROVED'" class="alert alert-success" role="alert"
               style="text-align: center">
            <i>승인완료</i>
          </div>
          <!--승인 거절 시 뜨는 알람, 거절 사유 입력하면 같이 뜨게 만들기-->
          <div v-else-if="this.status === 'DENIED'" class="alert alert-danger" role="alert" style="text-align: center">
            <i>승인거절 ( 거절사유 : {{ rejectReason }} )</i>
          </div>
          <!--지급완료 시 뜨는 알람-->
          <!--            <div class="alert alert-primary" role="alert" style="text-align: center">-->
          <!--              <i>지급완료</i>-->
          <!--            </div>-->
          <!--====================================제목 시작==============================================-->
          <div class="content-box">
            <!--게시글 작성자, 작성시간 나옴-->
            <div class="content-header">
              <div class="dlab-post-meta" style="margin: 0px">
                <ul class="d-flex align-items-center">
                  <!-- 게시글 작성자 -->
                  <li class="post-author"><i
                      class="ti ti-user"></i>By {{ applicationWriterName }}
                  </li>
                  <!-- 게시글 작성시간 -->
                  <li class="post-comment"><i
                      class="ti ti-alarm-clock">{{dateTime(dateCreated)}}</i>
                  </li>
                </ul>
              </div>
            </div>
            <!--여기까지-->
            <div class="content-body">
                <h3 class="font-24 font-bold">{{ title }}</h3>
            </div>
          </div>
          <!--====================================제목끝=============================================-->
          <!--====================================지출 날짜 시작==============================================-->
          <div class="content-box">
            <div class="content-header">
              <h3 class="title font-bold">지출날짜</h3>
            </div>
            <div class="content-body">
              <div class="form-group font-medium">
                <h4>{{ dateTime(dateUsed) }}</h4>
              </div>
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
                <a>{{ details }}</a>
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
                <a>{{ outcome }}</a>
              </div>
            </div>
          </div>
          <!--====================================지출금액 끝=============================================-->
          <!--====================================사용인 시작==============================================-->
          <div class="content-box">
            <div class="content-header">
              <h3 class="title font-bold">사용인</h3>
            </div>
            <div class="content-body">
              <div class="form-group font-medium">
                <a>{{ applicationWriterName }}</a>
              </div>
            </div>
          </div>
          <!--====================================사용인 끝=============================================-->
          <!--====================================입금계좌 시작==============================================-->
          <div class="content-box">
            <div class="content-header">
              <h3 class="title font-bold">입금받을 계좌</h3>
            </div>
            <div class="content-body">
              <div class="form-group font-medium">
                <a>{{ accounts }}</a>
              </div>
            </div>
          </div>
          <!--====================================입금계좌 끝=============================================-->
          <!--====================================영수증 시작=============================================-->

          <!--====================================영수증 끝=============================================-->
          <!-- 게시글 삭제 및 수정 div -->
          <!-- 게시글 삭제 및 수정 div -->
          <div class="extra-cell text-right">

            <!-- 게시글 수정 버튼 -->
            <!-- 관련자만 보이게 처리 -->
            <button class="site-button radius-xl m-l10 bg-bgColor hover:bg-bgColorHo focus:bg-bgColor"
                    @click="modify">
              <i class="fa fa-pencil m-r5"></i>지원서 수정
            </button>
            <!-- 게시글 삭제 버튼 -->
            <!-- 관련자만 보이게 처리 -->

            <button class="site-button red radius-xl m-l10" @click="delete_board">
              <!--                            onclick="goPage('{% url '#' board_no=board.board_no %}', true, '게시글은 삭제되면 복구가 불가능합니다.\n정말 삭제하시겠습니까?')">-->
              <i class="fa fa-trash m-r5"></i>지원서 삭제
            </button>
          </div>
          <!--=======승인/거절 버튼======-->
          <div class="d-flex justify-content-center m-t50">
            <div v-if="this.status === 'WAITING'">
              <!--승인-->
              <button type="button" class="btn btn-outline-success btn-lg width-200 font-bold">
                승인
              </button>

              <!--거절-->
              <button type="button" class="btn btn-outline-danger btn-lg width-200 m-l10 font-bold "
                      onclick="return confirm('승인을 거절하시겠습니까?')"
                      href="javascript:void(0);" data-toggle="modal" data-target="#favorite">
                거절
              </button>
            </div>
            <!--지급완료, 승인버튼 누르기 전에는 안나오고, 승인버튼 누르면 승인,거절 버튼은 없어지고 이 버튼만 보이게 함-->
            <button v-else-if="this.status === 'APPROVED'" type="button" class="btn btn-outline-primary btn-lg width-200 font-bold">
              지급완료
            </button>

          </div>
          <!---->
          <!-- 거절 버튼 누르면 나오는 창 -->
          <div class="modal fade modal-bx-info" id="favorite" tabindex="-1" role="dialog"
               aria-labelledby="FavoriteModalLongTitle" aria-hidden="true">
            <div class="modal-dialog " role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="FavoriteModalLongTitle">승인거절 사유</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"><i class="la la-close"></i></span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="tab-content nav">
                    <div id="login" class="tab-pane active"
                         style="margin-bottom: -25px; margin-top: 10px">
                      <form id="form-bank-support-reject"
                            action="#"
                            class="dlab-form"
                            method="post">
                        <!--승인 거절 사유 입력창-->
                        <input type="hidden" name="bank_apply_no" value="3">
                        <div class="form-group">
                          <input class="form-control"
                                 name="bank_reject_reason"
                                 placeholder="승인거절 사유를 입력해주세요"
                                 type="text" maxlength="50"/>
                        </div>
                        <!--거절버튼-->
                        <div class="form-group">
                          <button type="submit" class="site-button btn-block button-md"
                                  onclick="alert('승인이 거절되었습니다')">입력
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 거절 버튼 누르면 나오는 창 끝 -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "BudgetApplicationBoardDetail.vue",

  data() {
    return {
      id: this.$route.params.application_id,
      menuId: this.$route.params.menuId,
      title: '',
      details: '',
      applicationWriterName: '',
      dateUsed: '',
      dateCreated: '',
      outcome: '',
      accounts: '',
      status: '',
      rejectReason: '',
    }
  },

  methods: {
    delete_board() {
      if (confirm("지원서는 삭제되면 복구가 불가능합니다.\n정말 삭제하시겠습니까?")) {
        axios.delete('/api/budget/application/' + this.id)
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
    modify() {
      this.$router.push({path: "../register", query: {application_id: this.$route.params.application_id}});
    },
    dateTime(value) {
      return moment(value).format('YYYY-MM-DD hh:mm');
    }
  },

  created() {
    axios.get('/api/budget/application/' + this.id)
        .then(response => {
          this.title = response.data.title;
          this.details = response.data.details;
          this.applicationWriterName = response.data.application_writer_name;
          this.dateUsed = response.data.date_used;
          this.dateCreated = response.data.date_created;
          this.outcome = response.data.outcome;
          this.accounts = response.data.accounts;
          this.status = response.data.status;
          this.rejectReason = response.data.reject_reason;

          console.log(response)
        })
        .catch(error => console.log(error));
  },
}
</script>

<style scoped>

</style>