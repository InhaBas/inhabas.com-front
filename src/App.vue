<template>
  <Header></Header>
<!--  <RouterView />-->
  <router-view :key="$route.fullPath"></router-view>

  <Footer></Footer>
</template>

<script>
import Header from "@/common/Header"
import Footer from "@/common/Footer"

export default {
  components: { Header, Footer }
}
</script>

<style lang="css">
@import "../src/index.css";


</style>
<style lang="scss">
@import "scss/main";
</style>
