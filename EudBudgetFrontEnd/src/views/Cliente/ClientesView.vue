<template>
  <div class="column">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <img src="../../assets/img/loading.svg" alt="Loading..." class="loading-icon" />
    </div>

    <div class="row">
      <div
        class="card row justify-space-between align-center"
        style="height: 100px; border-bottom: 5px solid #6290c3"
      >
        <div class="text-lg text-bold">Clientes</div>
        <button @click="openModal">
          <span class="bi bi-plus-lg"></span>
        </button>
      </div>

      <CadastroClientesView
        v-if="isModalVisible"
        @close="closeModal"
        @client-saved="handleClientSaved"
      />
    </div>

    <div
      class="column client-cards-container mt-sm"
      style="overflow-y: auto; overflow-x: hidden; max-height: 70vh"
    >
      <div class="row my-xs mx-sm" v-for="cliente in clientes" :key="cliente.id">
        <ClienteCard :cliente="cliente" />
      </div>
    </div>

    <div class="row justify-center card" style="border-top: 5px solid #6290c3">
      <div class="text-md">Total em dinheiro:</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import CadastroClientesView from './CadastroClientes.vue'
import ClienteCard from './ClienteCard.vue'
import api from '@/api'
import ClienteEntity from '@/entity/ClienteEntity'

export default defineComponent({
  name: 'ClientesView',
  components: {
    CadastroClientesView,
    ClienteCard
  },
  setup() {
    const isModalVisible = ref(false)
    const clientes = ref<ClienteEntity[]>([])
    const isLoading = ref(false)

    const openModal = () => {
      isModalVisible.value = true
    }

    const closeModal = () => {
      isModalVisible.value = false
    }

    const handleClientSaved = (client: ClienteEntity) => {
      console.log('Cliente salvo:', client)
      closeModal()
      fetchClientes()
    }

    const fetchClientes = async () => {
      isLoading.value = true // Iniciar o loading
      try {
        const response = await api.get('clientes/cliente-get-clientes')
        clientes.value = response.data as ClienteEntity[]
        console.log(clientes)
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        isLoading.value = false // Finalizar o loading
      }
    }

    onMounted(() => {
      fetchClientes()
    })

    return {
      openModal,
      closeModal,
      isModalVisible,
      handleClientSaved,
      clientes,
      isLoading
    }
  }
})
</script>

<style scoped></style>
