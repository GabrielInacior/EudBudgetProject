<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavbarComponent from './components/Navbar.vue'
</script>

<template>
  <div class="page-container">
    <div class="row">
      <div class="column" style="max-width: 100px">
        <NavbarComponent />
      </div>
      <div class="column" style="margin-left: 20px">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
