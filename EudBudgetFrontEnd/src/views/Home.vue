<template>
  <div class="home-view" style="overflow: auto; max-height: 100vh">
    <div class="row card" style="border-bottom: 5px solid var(--lucro-color)">
      <div class="text-lg">Visão geral</div>
      <div class="column ml-lg" style="width: 150px">
        <label for="filter">Filtrar por data:</label>
        <select v-model="selectedFilter" @change="applyFilter" class="filter-dropdown">
          <option value="all">Todos</option>
          <option value="lastMonth">Último mês</option>
          <option value="lastYear">Último ano</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading">
      <div class="loading-overlay">
        <img src="../assets/img/loading.svg" alt="Loading..." class="loading-icon" />
      </div>
    </div>

    <div class="charts-container column align-center">
      <div class="row justify-center">
        <LucroGastoPieChart
          :servicos="servicos"
          :gastos="gastos"
          :selectedFilter="selectedFilter"
          class="margin-graph card"
          style="max-width: 18% !important; max-height: 15rem"
        />
        <LucroGastoChart
          :servicos="servicos"
          :gastos="gastos"
          :selectedFilter="selectedFilter"
          class="margin-graph card"
        />

        <EvolucaoLucroChart
          :servicos="servicos"
          :gastos="gastos"
          :selectedFilter="selectedFilter"
          class="margin-graph card"
        />
      </div>

      <div class="row justify-center">
        <ServicosGastosChart
          :servicos="servicos"
          :gastos="gastos"
          :selectedFilter="selectedFilter"
          class="margin-graph card"
          style="max-width: 18% !important; max-height: 15rem"
        />
        <EvolucaoServicosChart
          :servicos="servicos"
          :selectedFilter="selectedFilter"
          class="margin-graph card"
        />
        <EvolucaoGastosChart
          :gastos="gastos"
          :selectedFilter="selectedFilter"
          class="margin-graph card"
        />
      </div>
    </div>

    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import api from '@/api'
import ServicoEntity from '@/entity/ServicoEntity'
import GastoEntity from '@/entity/GastoEntity'
import LucroGastoChart from '@/components/Graficos/LucroGastoChart.vue'
import LucroGastoPieChart from '@/components/Graficos/LucroGastoPieChart.vue'
import EvolucaoGastosChart from '@/components/Graficos/EvolucaoGastosChart.vue'
import EvolucaoServicosChart from '@/components/Graficos/EvolucaoServicosChart.vue'
import EvolucaoLucroChart from '@/components/Graficos/EvolucaoLucroChart.vue'
import ServicosGastosChart from '@/components/Graficos/ServicosGastosChart.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    LucroGastoChart,
    LucroGastoPieChart,
    EvolucaoLucroChart,
    EvolucaoServicosChart,
    EvolucaoGastosChart,
    ServicosGastosChart
  },
  setup() {
    const selectedFilter = ref('all')
    const gastos = ref<GastoEntity[]>([])
    const servicos = ref<ServicoEntity[]>([])
    const isLoading = ref(false)
    const errorMessage = ref('')

    const applyFilter = async () => {
      isLoading.value = true
      const now = new Date()

      let startDate: Date | null = null
      let endDate: Date | null = null

      if (selectedFilter.value !== 'all') {
        switch (selectedFilter.value) {
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

      try {
        const gastosResponse = await api.get(`/gastos/gasto-get-gastos-by-filters`, { params })
        gastos.value = gastosResponse.data.map((gasto: any) => new GastoEntity(gasto))

        const servicosResponse = await api.get(`/servicos/servico-get-all-servicos-by-filters`, {
          params
        })
        servicos.value = servicosResponse.data.map((servico: any) => new ServicoEntity(servico))
      } catch (error) {
        errorMessage.value = 'Erro ao buscar dados: ' + error.message
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      applyFilter()
    })

    return {
      selectedFilter,
      gastos,
      servicos,
      isLoading,
      errorMessage,
      applyFilter
    }
  }
})
</script>

<style scoped>
.charts-container {
  min-height: 75vh;
  justify-content: space-between;
}
@media (min-width: 1600px) {
  .charts-container {
    min-height: 80vh;
  }
}
.margin-graph {
  margin: 0.5%;
}
.filter-dropdown {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--lucro-color);
  border-radius: 5px;
  margin-right: 1rem;
}

canvas {
  width: 40% !important;
  height: auto !important;
}
</style>
