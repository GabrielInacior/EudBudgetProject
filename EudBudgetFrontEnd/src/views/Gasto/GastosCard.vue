<template>
  <div class="row card justify-space-between" style="max-height: 210px">
    <div class="gasto-info">
      <div class="gasto-name">{{ gasto.nome }}</div>
      <div class="gasto-description text-light">{{ gasto.descricao }}</div>
      <div class="servico-data">{{ formatData(String(gasto.data)) }}</div>
      <div class="gasto-valor">R$ {{ gasto.valor.toFixed(2).replace('.', ',') }}</div>
    </div>

    <div class="row align-center justify-center" style="width: 120px">
      <div class="divider"></div>
      <div class="column">
        <div class="row">
          <button @click="editGasto" class="button-gasto">
            <span class="bi bi-pencil"></span>
          </button>
          <button class="button-gasto-outline mx-sm" @click="deleteGasto">
            <span class="bi bi-trash"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import api from '@/api'
import GastoEntity from '@/entity/GastoEntity'

export default defineComponent({
  name: 'GastosCard',
  props: {
    gasto: {
      type: Object as PropType<GastoEntity>,
      required: true
    }
  },
  setup(props, { emit }) {
    const editGasto = () => {
      emit('edit-gasto', props.gasto)
    }

    const deleteGasto = async () => {
      try {
        await api.delete(`/gastos/gasto-delete-gasto/${props.gasto.id}`)
        emit('gasto-deleted', props.gasto.id)
      } catch (error) {
        console.error('Error deleting gasto:', error)
      }
    }

    const formatData = (data: string): string => {
      const date = new Date(data)
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', year: 'numeric', month: 'long' }
      return date.toLocaleDateString('pt-BR', options).replace(',', '')
    }

    return {
      deleteGasto,
      editGasto,
      formatData
    }
  }
})
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 99%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.gasto-info {
  display: flex;
  flex-direction: column;
}
.gasto-name {
  font-weight: bold;
}
.divider {
  border-right: 1px solid rgb(102, 102, 102);
  height: 100%;
  margin: 0 15px;
}
</style>
