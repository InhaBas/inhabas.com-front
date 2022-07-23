<template>
  <div class="pagination-container">
    <ul class="pagination">
      <li class="paginate-buttons previous"
          v-if="pageSetting.first !== null"
          @click="pageSetting.first !== null ? sendPage(pageSetting.first) : ''">
        <i class="fa fa-arrow-left"></i>
      </li>
      <li class="paginate-buttons"
          v-for="page in pageSetting.list"
          :key="page"
          :class="{ 'current-page': page === pageSetting.currentPage }"
          @click="sendPage(page)"
          >
          {{page}}
      </li>
      <li class="paginate-buttons next"
          v-if="pageSetting.end !== null"
          @click="pageSetting.end !== null ? sendPage(pageSetting.end) : ''">
        <i class="fa fa-arrow-right"></i>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: ["pageSetting"],
  name: "Pagination.vue",

  methods: {
    sendPage(page) {
      this.$emit("paging", page)
      this.$emit("change-page", page)
    }
  }
}
</script>

<style>
.pagination{
  column-gap: 5px;
}

.pagination-container {
  display: flex;
  column-gap: 10px;
  justify-content: center;
  align-items: center;
}
.paginate-buttons {
  height: 45px;
  width: 45px;
  border-radius: 50px;
  cursor: pointer;
  border: 2px solid rgba(46,56,65,.1);
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}
.paginate-buttons:hover {
  background-color: #4611a7;
  color: white;
}
.current-page {
  background-color: #4611a7;
  border: 1px solid #4611a7;
  color: white;
}
.current-page:hover {
  background-color: #4611a7;
  color: white;
}
</style>