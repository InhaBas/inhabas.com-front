<template>

  <div class="modal-overlay">
    <div class="the-modal">
      <div class="modal-header bg-bgColor font-bold">
        <h5 class="modal-title">승인거절 사유</h5>
        <div class="modal-close" @click="$emit('close-modal')">
          <img src="@/assets/images/x-solid-white.svg" alt="현재 브라우저에서 지원하지 않는 형식입니다.">
        </div>
      </div>
      <div class="modal-body bg-white">
        <!--승인 거절 사유 입력창-->
        <div>
          <input id="reject-input" class="modal-input focus:outline-none"
                 placeholder="승인거절 사유를 입력해주세요"
                 type="text" maxlength="50"/>
        </div>
        <!--거절버튼-->
          <button class="mt-3 pt-2 pb-2 text-white w-full decoration-white rounded bg-bgColor"
                  @click="status_denied">입력
          </button>
          </div>
        </div>
      </div>


</template>

<script>
import axios from "axios";

export default {
  name: "TheModal.vue",
  props:["id"],
  methods:{
    budgetApplicationRejectReason() {
      // var reject_input =
      // this.$emit('reject-reason', reject_input.value)
      console.log("모달에서는 했다")
    },
    status_denied() {
      this.change_form =  {
        status: 'DENIED',
        reject_reason: document.getElementById("reject-input").value,
        id: this.id
      }
      console.log(this.id)
      axios.put('/api/budget/application/'+ this.id + '/status', this.change_form)
          .then(()=>{
            alert('승인거절 되었습니다');
            this.$router.go(-1)
          })
          .catch((err)=>{
            alert('승인거절에 실패하였습니다')
            console.log(err);
          })
    },
  }
}
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
}

.the-modal {
  text-align: center;
  height: fit-content;
  width: 25%;
  margin-top: 20%;
  z-index: 101;
}

.modal-input {
  border-bottom: 2px solid #e7e7ed;
  padding: 0;
  width: 100%;
  line-height: normal;
  height: 38px;
}

.modal-close {
  width: 3%;
  cursor: pointer;
}

</style>