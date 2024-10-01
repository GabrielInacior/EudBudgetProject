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

          <div class="row align-center">
            <div class="column text-lg text-bold ml-sm" style="width: 120px; text-align: center">
              Serviços:<br />
              <span class="text-lg text-bold" style="color: var(--lucro-color)">{{
                clienteNome
              }}</span>
            </div>
            <div class="column ml-sm" style="width: 200px">
              <div class="text-md">Filtrar por nome:</div>
              <input
                type="text"
                v-model="nomeFiltro"
                @keyup.enter="applyFilter"
                placeholder="Pesquisar (ENTER)"
                class="filter-input"
              />
            </div>
            <div class="column mx-md" style="width: 150px">
              <div class="text-md">Filtrar por data:</div>
              <select v-model="selectedFilter" @change="applyFilter" class="filter-dropdown">
                <option value="all">Todos</option>
                <option value="today">Hoje</option>
                <option value="lastMonth">Último mês</option>
                <option value="lastYear">Último ano</option>
              </select>
            </div>
          </div>
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

    <div class="column service-cards-container mt-sm" v-if="servicos.length > 0">
      <div class="row my-xs mx-sm" v-for="servico in servicos" :key="servico.id">
        <ServicoCard
          :servico="servico"
          @service-deleted="handleServiceDeleted"
          @edit-service="openModal"
        />
      </div>
    </div>
    <div class="column align-center justify-center img-404" v-else>
      <div v-if="isLoading" class="loading-overlay">
        <img src="../../assets/img/loading.svg" alt="Loading..." class="loading-icon" />
      </div>
      <img src="../../assets/img/ServicoNot.svg" />
      <div style="font-size: 1.3rem" class="text-bold">Ops! Nenhum serviço encontrado!</div>
    </div>

    <div
      class="row justify-center align-center card footer"
      style="border-top: 5px solid var(--lucro-color)"
    >
      <div style="font-size: 1.2rem">
        Total em dinheiro: R$
        {{ totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
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
    const selectedFilter = ref('all')
    const nomeFiltro = ref('')

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
      applyFilter()
    }

    const applyFilter = async () => {
      isLoading.value = true
      const now = new Date()

      let startDate: Date | null = null
      let endDate: Date | null = null

      if (selectedFilter.value !== 'all') {
        switch (selectedFilter.value) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
            break
          case 'lastMonth':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            endDate = new Date(now.getFullYear(), now.getMonth(), 0)
            break
          case 'lastYear':
            startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
            endDate = now
            break
        }
      }

      const params: any = {
        clienteId
      }

      if (startDate && endDate) {
        params.startDate = startDate.toISOString()
        params.endDate = endDate.toISOString()
      }

      if (nomeFiltro.value.trim()) {
        params.nome = nomeFiltro.value
      }

      try {
        const response = await api.get(`/servicos/servico-get-servicos-by-filters`, {
          params
        })
        servicos.value = response.data as ServicoEntity[]
      } catch (error) {
        console.error('Error filtering services:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleServiceSaved = () => {
      applyFilter()
      closeModal()
    }
    const totalValor = computed(() => {
      return servicos.value.reduce((total, servico) => {
        return total + servico.valor
      }, 0)
    })

    onMounted(() => {
      applyFilter()
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
      totalValor,
      selectedFilter,
      applyFilter,
      nomeFiltro
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

.filter-dropdown {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--lucro-color);
  border-radius: 5px;
  margin-right: 1rem;
}

.filter-input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--lucro-color);
  border-radius: 5px;
  margin-right: 1rem;
}

@media (min-width: 1600px) {
  .footer {
    height: 10vh;
  }
  .img-404 {
    height: 79vh;
  }
  .service-cards-container {
    max-height: 79vh;
    min-height: 79vh;
  }
}
</style>
