<template>
  <div class="row card justify-space-between">
    <div class="servico-info">
      <div class="servico-nome">{{ servico.nome }}</div>
      <div class="servico-data">{{ formatData(String(servico.data)) }}</div>
      <div class="servico-valor">{{ servico.valor }}</div>
    </div>
    <div class="column" style="width: 78px">
      <div class="row">
        <button class="mx-xs"><span class="bi bi-pencil"></span></button>
        <button class="button-outline" @click="deleteServico">
          <span class="bi bi-trash"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ServicoEntity from '@/entity/ServicoEntity'
import api from '@/api'

export default defineComponent({
  name: 'ServicoCard',
  props: {
    servico: {
      type: Object as PropType<ServicoEntity>,
      required: true
    }
  },
  methods: {
    formatData(data: string): string {
      const date = new Date(data)
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', year: 'numeric', month: 'long' }
      return date.toLocaleDateString('pt-BR', options).replace(',', '') // Remove a vírgula
    },
    async deleteServico() {
      try {
        await api.delete(`/servicos/servico-delete-servico/${this.servico.id}`)
        this.$emit('service-deleted', this.servico.id) // Emitir evento para o pai
      } catch (error) {
        console.error('Error deleting service:', error)
      }
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
.servico-info {
  display: flex;
  flex-direction: column;
}
.servico-nome {
  font-weight: bold;
}
</style>
