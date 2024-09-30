<template>
  <div class="row card justify-space-between" style="max-height: 210px">
    <div class="client-info">
      <div class="client-name">{{ cliente.nome }}</div>
      <div class="client-address text-light">{{ cliente.endereco }}</div>
      <div class="client-phone">{{ cliente.telefone }}</div>
    </div>

    <div class="row align-center justify-center" style="width: 250px">
      <div class="column align-center">
        <div class="row text-md align-center justify-center">
          Valor total de serviços<br />R$ {{ cliente.totalServicos.toFixed(2).replace('.', ',') }}
        </div>
      </div>
      <div class="divider"></div>
      <div class="column">
        <div class="row">
          <button @click="editCliente"><span class="bi bi-pencil"></span></button>
          <button class="button-outline mx-sm" @click="deleteCliente">
            <span class="bi bi-trash"></span>
          </button>
        </div>
        <div class="row mt-sm">
          <button class="button-outline" @click="goServicos" style="width: 90px">
            <span class="text-sm">Adicionar Serviço</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import ClienteEntity from '@/entity/ClienteEntity'
import api from '@/api'

export default defineComponent({
  name: 'ClienteCard',
  props: {
    cliente: {
      type: Object as PropType<ClienteEntity>,
      required: true
    }
  },
  setup(props, { emit }) {
    const router = useRouter()

    const goServicos = () => {
      router.push({
        name: 'Servicos',
        params: { clienteId: props.cliente.id, clientName: props.cliente.nome }
      })
    }

    const editCliente = () => {
      emit('edit-client', props.cliente) // Passa o cliente completo para o modal
    }

    const deleteCliente = async () => {
      try {
        await api.delete(`/clientes/cliente-delete-cliente/${props.cliente.id}`)
        emit('cliente-deleted', props.cliente.id)
      } catch (error) {
        console.error('Error deleting client:', error)
      }
    }

    return {
      goServicos,
      deleteCliente,
      editCliente
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
  margin: 0 15px;
}
</style>
