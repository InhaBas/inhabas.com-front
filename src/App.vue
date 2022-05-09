<template>
<!--  <RouterView />-->
  <router-view :key="$route.fullPath"></router-view>
</template>


<style lang="css">
@import "../src/index.css";


</style>
<style lang="scss">
@import "scss/main";
</style>
