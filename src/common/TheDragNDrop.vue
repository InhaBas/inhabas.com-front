<template>
  <div class="text-sm">
    <div class="w-full h-44 border-2 border-dashed border-gray-300">
      <div v-if="images" class="w-full flex items-center">
        <img :src="images" alt="image">
      </div>
      <div v-else class="w-full h-full flex flex-column justify-content-xl-evenly align-items-center cursor-pointer"
           @click="clickInputTag()"
           @drop.prevent="dropInputTag($event)"
           @dragover.prevent>
        <input ref="image" id="input"
               type="file" name="image" accept="image/*" multiple="multiple"
               class="hidden"
               @change="uploadImage()">
<!--        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />-->
<!--        </svg>-->
<!--        <i class="fa fa-cloud-upload bg-gray-500"></i>-->
          <i class="fas fa-cloud-upload-alt fa-4x text-gray-300 flex align-items-center justify-content-center"></i>
        <div class="justify-content-center align-items-center flex align-items-center justify-content-center text-lg text-black">마우스로 파일을 끌어오세요.</div>
        <button type="button" class="w-1/4 btn btn-default bg-bgColor hover:bg-bgColorHo text-white font-semibold" style="background-color: #4611a7; border-radius: 999px !important;">파일 첨부</button>
      </div>
    </div>
  </div>


</template>

<script>
import axios from 'axios'

export default {
  name: "DragNDrop",
  data: ()=>({
    images: ''
  }),
  methods: {
    uploadImage: function(file) {
      let form = new FormData()
      let image = file || this.$refs['image'].files[0]

      form.append('image', image)

      axios.post('/upload', form, {
        header: { 'Content-Type': 'multipart/form-data' }
      }).then( ({data}) => {
        this.images = data
      })
          .catch( err => console.log(err))
    },
    dropInputTag: function(event) {
      let file = Array.from(event.dataTransfer.files, v => v)[0]
      this.uploadImage(file)
    },
    clickInputTag: function() {
      this.$refs['image'].click()
    }
  }
}
</script>

<style scoped>

</style>