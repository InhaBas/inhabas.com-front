<template>
  <h1 class="text-3xl font-bold underline text-blue-900 bg-gray-600">
    Hello world!
  </h1>
  <ul>
    <li class="font-bold"><RouterLink to="/" class="text-textColor">Home</RouterLink></li>
    <li><RouterLink to="/about">About</RouterLink></li>
    <li><RouterLink to="/board">Board</RouterLink></li>
    <li><RouterLink to="/contestBoard">Contest Board</RouterLink></li>
    <li><RouterLink to="/dragNDrop">DragNDrop</RouterLink></li>
  </ul>

</template>

<script>export default {
  components: {}
}
</script>

