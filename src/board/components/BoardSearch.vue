<template>
  <!-- 게시글 검색창 -->
  <!-- 검색 시, 전체 게시판의 게시글들 중 해당 키워드를 포함한 게시글을 모두 끌고옴 -->
  <div class="listing-filter-sidebar" style="margin-bottom: 30px">
    <div style="margin-bottom: 20px">
      <h4 class="title mb-3">게시글 검색</h4>
      <div class="">
        <form role="search"
              action="/board/search/1"
              method="get">
          <div class="input-group">
            <input name="keyword" type="text" class="form-control focus:outline-none" style="font-size: 13px"
                   placeholder="검색어를 입력하세요.">
            <span class="input-group-btn">
              <button type="submit" class="site-button bg-bgColor hover:bg-bgColorHo">
                <i class="fa fa-search"></i>
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BoardSearch.vue"
}
</script>

<style scoped>

</style>