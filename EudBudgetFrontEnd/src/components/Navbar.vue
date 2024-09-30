<template>
  <div class="column card align-center" style="height: 100vh">
    <div class="logo-box mx-sm">
      <img src="../assets/img/EudLogo.png" />
    </div>
    <div
      class="text-md text-bold tc-primary mx-sm"
      :class="{ 'active-route': isActive('/') }"
      @click="navigateTo('/')"
    >
      Home
    </div>
    <div
      class="text-md text-bold tc-primary mx-sm"
      :class="{ 'active-route': isActive('/cliente') }"
      @click="navigateTo('/cliente')"
    >
      Clientes
    </div>
    <div
      class="text-md text-bold tc-primary mx-sm"
      :class="{ 'active-route': isActive('/gastos') }"
      @click="navigateTo('/gastos')"
    >
      Gastos
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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
      isActive
    }
  }
})
</script>

<style scoped>
.logo-box {
  width: 60px;
  height: 50px;
}
.logo-box img {
  width: 100%;
}
.row {
  border-radius: 10px;
  border-bottom: 5px solid #1a1b41;
}
.text-md:hover {
  color: #6290c3;
  cursor: pointer;
}
.active-route {
  color: #3574bd; /* Cor da rota ativa */
}
</style>
