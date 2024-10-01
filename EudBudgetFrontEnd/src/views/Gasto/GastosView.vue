<template>
  <div class="column">
    <div v-if="isLoading" class="loading-overlay">
      <img src="../../assets/img/loading.svg" alt="Loading..." class="loading-icon" />
    </div>

    <div class="row">
      <div
        class="card row justify-space-between align-center"
        style="height: 100px; border-bottom: 5px solid var(--gasto-color)"
      >
        <div class="text-lg text-bold mr-sm">Gastos</div>

        <div class="row align-center ml-md">
          <div class="column" style="width: 200px">
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

        <button @click="openModal" class="button-gasto">
          <span class="bi bi-plus-lg"></span>
        </button>
      </div>

      <CadastroGastos
        v-if="isModalVisible"
        :gastoId="gastoEdit?.id"
        @close="closeModal"
        @gasto-saved="handleGastoSaved"
      />
    </div>

    <div class="column gastos-cards-container mt-sm" v-if="gastos.length > 0">
      <div class="row my-xs mx-sm" v-for="gasto in gastos" :key="gasto.id">
        <GastosCard
          :gasto="gasto"
          @gasto-deleted="handleGastoDeleted"
          @edit-gasto="openModalForEdit"
        />
      </div>
    </div>
    <div class="column align-center justify-center img-404" v-else>
      <div v-if="isLoading" class="loading-overlay">
        <img src="../../assets/img/loading.svg" alt="Loading..." class="loading-icon" />
      </div>
      <img src="../../assets/img/GastoNot.svg" />
      <div style="font-size: 1.3rem" class="text-bold">Opa! Nenhum gasto encontrado!</div>
    </div>

    <div class="row justify-center card footer" style="border-top: 5px solid var(--gasto-color)">
      <div class="column align-center">
        <div style="font-size: 1rem">Total em gastos:</div>
        <div
          class="text-bold"
          style="font-size: 2rem; margin-top: -0.5%; color: var(--gasto-color)"
        >
          R$ {{ totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import GastosCard from './GastosCard.vue'
import CadastroGastos from './CadastroGastos.vue'
import api from '@/api'
import GastoEntity from '@/entity/GastoEntity'

export default defineComponent({
  name: 'GastosView',
  components: {
    CadastroGastos,
    GastosCard
  },
  setup() {
    const isModalVisible = ref(false)
    const gastos = ref<GastoEntity[]>([])
    const isLoading = ref(false)
    const gastoEdit = ref<GastoEntity | null>(null)
    const errorMessage = ref<string | null>(null)
    const selectedFilter = ref('all')
    const nomeFiltro = ref('')

    const openModal = () => {
      isModalVisible.value = true
      gastoEdit.value = null
    }

    const closeModal = () => {
      isModalVisible.value = false
      gastoEdit.value = null
    }

    const handleGastoSaved = (gasto: GastoEntity) => {
      closeModal()
      applyFilter()
    }

    const handleGastoDeleted = (gastoId: number) => {
      gastos.value = gastos.value.filter((gasto) => gasto.id !== gastoId)
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

      const params: any = {}

      if (startDate && endDate) {
        params.startDate = startDate.toISOString()
        params.endDate = endDate.toISOString()
      }

      if (nomeFiltro.value.trim()) {
        params.nome = nomeFiltro.value
      }

      try {
        const response = await api.get(`/gastos/gasto-get-gastos-by-filters`, {
          params
        })
        gastos.value = response.data as GastoEntity[]
      } catch (error) {
        console.error('Error filtering services:', error)
      } finally {
        isLoading.value = false
      }
    }

    const openModalForEdit = (gasto: GastoEntity) => {
      gastoEdit.value = gasto
      isModalVisible.value = true
    }

    const totalGasto = computed(() => {
      return gastos.value.reduce((total, gasto) => {
        const gastoValue = typeof gasto.valor === 'string' ? parseFloat(gasto.valor) : gasto.valor
        return total + (gastoValue || 0)
      }, 0)
    })

    onMounted(() => {
      applyFilter()
    })

    return {
      openModal,
      closeModal,
      handleGastoSaved,
      applyFilter,
      isModalVisible,
      gastos,
      isLoading,
      gastoEdit,
      openModalForEdit,
      handleGastoDeleted,
      totalGasto,
      selectedFilter,
      errorMessage,
      nomeFiltro
    }
  }
})
</script>

<style scoped>
.footer {
  border-top: 5px solid var(--gasto-color);
  height: 20vh;
  width: 99%;
}

.filter-dropdown {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--gasto-color);
  border-radius: 5px;
  margin-right: 1rem;
}

.gastos-cards-container {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 72vh;
  min-height: 72vh;
}

@media (min-width: 1600px) {
  .footer {
    height: 10vh;
  }
  .gastos-cards-container {
    max-height: 79vh;
    min-height: 79vh;
  }
}
</style>
