<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import { ref, provide } from 'vue'
  export default {
    name: 'App',
    setup() {
      const menuVisible = ref(false)
      provide('menu', menuVisible)
    }
  }
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>