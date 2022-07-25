<template>
  <TheHeaderTitle></TheHeaderTitle>
  <router-view></router-view>
</template>

<script>
import TheHeaderTitle from "@/common/TheHeaderTitle"

export default {
  name: "DefaultLayout.vue",
  components: {TheHeaderTitle}
}
</script>

<style scoped>

</style>