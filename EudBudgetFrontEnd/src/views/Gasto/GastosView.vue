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
        <div class="text-lg text-bold">Gastos</div>
        <button @click="openModal" class="button-gasto"><span class="bi bi-plus-lg"></span></button>
      </div>

      <CadastroGastos
        v-if="isModalVisible"
        :gastoId="gastoEdit?.id"
        @close="closeModal"
        @gasto-saved="handleGastoSaved"
      />
    </div>

    <div class="column gastos-cards-container mt-sm">
      <div class="row my-xs mx-sm" v-for="gasto in gastos" :key="gasto.id">
        <GastosCard
          :gasto="gasto"
          @gasto-deleted="handleGastoDeleted"
          @edit-gasto="openModalForEdit"
        />
      </div>
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
      fetchGastos()
    }

    const handleGastoDeleted = (gastoId: number) => {
      gastos.value = gastos.value.filter((gasto) => gasto.id !== gastoId)
    }

    const fetchGastos = async () => {
      isLoading.value = true
      errorMessage.value = null
      try {
        const response = await api.get('gastos/gasto-get-gastos')
        gastos.value = response.data.map((item: any) => new GastoEntity(item))
      } catch (error) {
        console.error('Error fetching gastos:', error)
        errorMessage.value = 'Erro ao buscar os gastos. Tente novamente mais tarde.'
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
      fetchGastos()
    })

    return {
      openModal,
      closeModal,
      handleGastoSaved,
      fetchGastos,
      isModalVisible,
      gastos,
      isLoading,
      gastoEdit,
      openModalForEdit,
      handleGastoDeleted,
      totalGasto,
      errorMessage
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
