<template>
<h1></h1>
</template>

<script>
import { useCookies } from "vue3-cookies";

export default {
  name: "LoginSuccessNaver.vue",

  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },

  created() {
    const urlParams = new URL(location.href).searchParams;
    const accessToken = urlParams.get('access_token');
    this.cookies.set("accessToken", accessToken);
    const host = window.location.host;
    window.location.href = 'http://' + host
  }
}
</script>

<style scoped>

</style>