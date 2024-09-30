<template>
  <div class="column">
    <div v-if="isLoading" class="loading-overlay">
      <img src="../../assets/img/loading.svg" alt="Loading..." class="loading-icon" />
    </div>

    <div class="row">
      <div
        class="card row justify-space-between align-center"
        style="height: 100px; border-bottom: 5px solid var(--lucro-color)"
      >
        <div class="text-lg text-bold">Clientes</div>
        <button @click="openModal"><span class="bi bi-plus-lg"></span></button>
      </div>

      <CadastroClientesView
        v-if="isModalVisible"
        :clienteId="clienteEdit?.id"
        @close="closeModal"
        @client-saved="handleClientSaved"
      />
    </div>

    <div class="column client-cards-container mt-sm">
      <div class="row my-xs mx-sm" v-for="cliente in clientes" :key="cliente.id">
        <ClienteCard
          :cliente="cliente"
          @cliente-deleted="handleClienteDeleted"
          @edit-client="openModalForEdit"
        />
      </div>
    </div>

    <div class="row justify-center card footer" style="border-top: 5px solid var(--lucro-color)">
      <div class="column align-center">
        <div style="font-size: 1rem">Total em dinheiro:</div>
        <div
          class="text-bold"
          style="font-size: 2rem; margin-top: -0.5%; color: var(--lucro-color)"
        >
          R$ {{ calcularTotal() }}
        </div>
      </div>
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
    const clienteEdit = ref<ClienteEntity | null>(null)

    const openModal = () => {
      isModalVisible.value = true
      clienteEdit.value = null
    }

    const closeModal = () => {
      isModalVisible.value = false
      clienteEdit.value = null
    }

    const handleClientSaved = (client: ClienteEntity) => {
      closeModal()
      fetchClientes()
    }

    const handleClienteDeleted = (clienteId: number) => {
      clientes.value = clientes.value.filter((cliente) => cliente.id !== clienteId)
    }

    const fetchClientes = async () => {
      isLoading.value = true
      try {
        const response = await api.get('clientes/cliente-get-clientes')
        clientes.value = response.data as ClienteEntity[]
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        isLoading.value = false
      }
    }

    const openModalForEdit = (cliente: ClienteEntity) => {
      clienteEdit.value = cliente
      console.log(clienteEdit.value)
      isModalVisible.value = true
    }

    const calcularTotal = () => {
      return clientes.value.reduce((total, cliente) => total + (cliente.totalServicos || 0), 0)
    }

    onMounted(() => {
      fetchClientes()
    })

    return {
      openModal,
      closeModal,
      handleClientSaved,
      fetchClientes,
      isModalVisible,
      clientes,
      isLoading,
      clienteEdit,
      openModalForEdit,
      handleClienteDeleted,
      calcularTotal
    }
  }
})
</script>

<style scoped>
.footer {
  height: 20vh;
  width: 99%;
}

.client-cards-container {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 72vh;
  min-height: 72vh;
}

@media (min-width: 1600px) {
  .footer {
    height: 10vh;
  }
  .client-cards-container {
    max-height: 79vh;
    min-height: 79vh;
  }
}
</style>
