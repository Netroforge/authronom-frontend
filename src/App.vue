<template>
  <div id="app" class="app-container">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensures the container is at least the height of the viewport */
}
</style>
