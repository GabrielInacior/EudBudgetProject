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
        <div class="row">
          <button class="button-outline" @click="back">
            <span class="bi bi-arrow-left"></span>
          </button>
          <div class="text-lg text-bold">Serviços: {{ clienteNome }}</div>
        </div>

        <button @click="openModal(null)">
          <span class="bi bi-plus-lg"></span>
        </button>
      </div>
      <CadastroServicos
        v-if="isModalVisible"
        @close="closeModal"
        @servico-saved="handleServiceSaved"
        :servicoId="selectedServicoId"
        :clienteId="Number(clienteId)"
      />
    </div>

    <div class="column service-cards-container mt-sm">
      <div class="row my-xs mx-sm" v-for="servico in servicos" :key="servico.id">
        <ServicoCard
          :servico="servico"
          @service-deleted="handleServiceDeleted"
          @edit-service="openModal"
        />
      </div>
    </div>

    <div
      class="row justify-center align-center card footer"
      style="border-top: 5px solid var(--lucro-color)"
    >
      <div style="font-size: 1.2rem">
        Total em dinheiro: R$ {{ totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
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
    const selectedServicoId = ref<number | null>(null)
    const servicos = ref<ServicoEntity[]>([])
    const route = useRoute()
    const router = useRouter()
    const clienteId = route.params.clienteId
    const clienteNome = route.params.clientName
    const isLoading = ref(false)

    const back = () => {
      router.push({ name: 'Clientes' })
    }

    const openModal = (servicoId: number | null) => {
      selectedServicoId.value = servicoId
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

    const totalValor = computed(() => {
      return servicos.value.reduce((total, servico) => total + servico.valor, 0)
    })

    onMounted(() => {
      fetchServicos()
    })

    return {
      openModal,
      closeModal,
      isModalVisible,
      selectedServicoId,
      handleServiceDeleted,
      servicos,
      isLoading,
      handleServiceSaved,
      clienteId,
      clienteNome,
      back,
      totalValor
    }
  }
})
</script>

<style scoped>
.footer {
  height: 13vh;
  width: 99%;
}

.service-cards-container {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 72vh;
  min-height: 72vh;
}

@media (min-width: 1600px) {
  .footer {
    height: 10vh;
  }
  .service-cards-container {
    max-height: 79vh;
    min-height: 79vh;
  }
}
</style>
