<template>
  <div class="pagination-bx clearfix text-center">
    <ul class="pagination">
      <li class="previous">
       <router-link :to="`page=${page-1}`" class="rounded-circle" v-if="page!==0">
         <i class="fa fa-arrow-left"></i>
       </router-link>
      </li>
      <li v-for="id in 5" :key="id">
        <router-link :to="`page=${id}`">{{id}}</router-link>
      </li>
<!--      <li><a href="javascript:void(0)">2</a></li>-->
<!--      <li><a href="javascript:void(0)">...</a></li>-->
<!--      <li class="active"><a href="javascript:void(0)">7</a></li>-->
      <li class="next"><router-link to="/list" class="rounded-circle"><i class="fa fa-arrow-right"></i></router-link></li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props:["totalPages","page"],
  name: "Paginations.vue",
  data()
  {
    return{
      menuId:this.$route.params.id,
    }
  },
  created(){
    axios.get('https://dev.inhabas.com/api/board/all?menuId='+this.menuId+'&page='+this.page)
        .then(response => {
          this.content = response.data.content;
          console.log(response)})
        .catch(error => console.log(error));
  },
}
</script>

<style scoped>

</style>