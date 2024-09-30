<template>
  <div class="row card justify-space-between" style="max-height: 210px">
    <div class="client-info">
      <div class="client-name">{{ cliente.nome }}</div>
      <div class="client-address text-light">{{ cliente.endereco }}</div>
      <div class="client-phone">{{ cliente.telefone }}</div>
    </div>

    <div class="row" style="width: 200px">
      <div class="column align-center">
        <div class="row text-md align-center justify-center">
          Valor total<br />R$ {{ valorTotal.toFixed(2).replace('.', ',') }}
        </div>
      </div>
      <div class="divider"></div>
      <div class="column">
        <div class="row">
          <button class="mx-xs"><span class="bi bi-pencil"></span></button>
          <button class="button-outline"><span class="bi bi-trash"></span></button>
        </div>
        <div class="row mt-sm">
          <button class="button-outline" @click="goServicos">
            <span class="text-sm"> Adicionar Serviço</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClienteEntity from '@/entity/ClienteEntity'
import api from '@/api' // Importar seu arquivo de configuração da API

export default defineComponent({
  name: 'ClienteCard',
  props: {
    cliente: {
      type: Object as PropType<ClienteEntity>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const valorTotal = ref(0)

    const goServicos = () => {
      router.push({
        name: 'Servicos',
        params: { clienteId: props.cliente.id, clientName: props.cliente.nome }
      })
    }

    const fetchValorTotal = async () => {
      try {
        const response = await api.get(`/servicos?clienteId=${props.cliente.id}`) // Ajuste a rota conforme necessário
        const servicos = response.data
        valorTotal.value = servicos.reduce((total, servico) => total + servico.valor, 0)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    onMounted(() => {
      fetchValorTotal()
    })

    return {
      goServicos,
      valorTotal
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
.client-info {
  display: flex;
  flex-direction: column;
}
.client-name {
  font-weight: bold;
}
.divider {
  border-right: 1px solid rgb(102, 102, 102);
  height: 100%;
  margin: 0 15px 0 15px;
}
</style>
