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
        <div class="row">
          <button class="button-outline" @click="back">
            <span class="bi bi-arrow-left"></span>
          </button>
          <div class="text-lg text-bold">Serviços: {{ clienteNome }}</div>
        </div>

        <button @click="openModal">
          <span class="bi bi-plus-lg"></span>
        </button>
      </div>

      <CadastroServicos
        v-if="isModalVisible"
        @close="closeModal"
        @service-saved="handleServiceSaved"
        :clienteId="Number(clienteId)"
      />
    </div>

    <div
      class="column client-cards-container mt-sm"
      style="overflow-y: auto; overflow-x: hidden; max-height: 70vh; min-height: 70vh"
    >
      <div class="row my-xs mx-sm" v-for="servico in servicos" :key="servico.id">
        <ServicoCard :servico="servico" @service-deleted="handleServiceDeleted" />
      </div>
    </div>

    <div class="row justify-center card" style="border-top: 5px solid #6290c3">
      <div class="text-md">Total em dinheiro:</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import CadastroServicos from './CadastroServicos.vue'
import ServicoCard from './ServicoCard.vue'
import api from '@/api'
import ServicoEntity from '@/entity/ServicoEntity'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ServicosView',
  components: {
    CadastroServicos,
    ServicoCard
  },
  setup() {
    const isModalVisible = ref(false)
    const servicos = ref<ServicoEntity[]>([])
    const route = useRoute()
    const router = useRouter()
    const clienteId = route.params.clienteId
    const clienteNome = route.params.clientName
    const isLoading = ref(false)

    const back = () => {
      router.push({ name: 'Clientes' })
    }

    const openModal = () => {
      isModalVisible.value = true
    }

    const closeModal = () => {
      isModalVisible.value = false
    }
    const handleServiceDeleted = (servicoId: number) => {
      servicos.value = servicos.value.filter((servico) => servico.id !== servicoId)
      fetchServicos()
    }

    const fetchServicos = async () => {
      isLoading.value = true
      try {
        const response = await api.get(`/servicos/cliente/${clienteId}`)
        servicos.value = response.data as ServicoEntity[]
        console.log(servicos)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleServiceSaved = () => {
      fetchServicos()
      closeModal()
    }

    onMounted(() => {
      console.log(clienteNome)
      fetchServicos()
    })

    return {
      openModal,
      closeModal,
      isModalVisible,
      handleServiceDeleted,
      servicos,
      isLoading,
      handleServiceSaved,
      clienteId,
      clienteNome,
      back
    }
  }
})
</script>

<style scoped></style>
