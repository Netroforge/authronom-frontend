<template>
  <div id="app" class="app-container">
    <NavbarComponent />
    <router-view/>
  </div>
</template>

<script>
import NavbarComponent from "@/components/NavbarComponent.vue";

export default {
  name: 'App',
  components: {NavbarComponent}
}
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 90vh; /* Ensures the container is at least the height of the viewport */
}
</style>
