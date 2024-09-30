<template>
  <div class="column card align-center" style="height: 100vh">
    <div class="logo-box mx-sm">
      <img :src="isDarkTheme ? logoDark : logoWhite" />
    </div>
    <div class="so-column align-space-between" style="height: 90vh">
      <div class="so-column">
        <div
          class="nav-item text-md text-bold mx-sm"
          :class="{ 'active-route': isActive('/') }"
          @click="navigateTo('/')"
        >
          Home
        </div>
        <div
          class="nav-item text-md text-bold mx-sm"
          :class="{ 'active-route': isActive('/cliente') }"
          @click="navigateTo('/cliente')"
        >
          Clientes
        </div>
        <div
          class="nav-item text-md text-bold mx-sm"
          :class="{ 'active-route': isActive('/gastos') }"
          @click="navigateTo('/gastos')"
        >
          Gastos
        </div>
      </div>

      <button @click="toggleTheme" class="theme-toggle-button" style="color: #588d35">
        <i class="bi" :class="isDarkTheme ? 'bi-sun' : 'bi-moon'"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import logoDark from '../assets/img/EudLogoDark.png'
import logoWhite from '../assets/img/EudLogoWhite.png'
import theme from '@/theme'

export default defineComponent({
  name: 'NavbarComponent',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const navigateTo = (path: string) => {
      router.push(path)
    }

    const isActive = (path: string) => {
      return route.path === path
    }

    return {
      navigateTo,
      isActive,
      toggleTheme: theme.toggleTheme,
      isDarkTheme: theme.isDarkTheme,
      logoDark,
      logoWhite
    }
  }
})
</script>

<style scoped>
.logo-box {
  width: 90px;
  height: 50px;
  margin-bottom: 50px;
}
.logo-box img {
  width: 100%;
}
.row {
  border-radius: 10px;
  border-bottom: 5px solid #1a1b41;
}
.theme-toggle-button {
  background-color: transparent;
  border: none; /* Remove o border */
  color: var(--color-primary);
  cursor: pointer;
  font-size: 24px; /* Tamanho do ícone */
}
.dark-theme {
  background-color: var(--vt-c-black);
  color: var(--vt-c-white);
}
</style>
