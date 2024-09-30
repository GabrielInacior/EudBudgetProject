<template>
  <ModalComponent @close="handleClose" size="large">
    <template #header>
      <h3>{{ client.id ? 'Editar Cliente' : 'Cadastrar Cliente' }}</h3>
    </template>

    <template #default>
      <div class="column">
        <div class="row">
          <div class="column mx-xs">
            <label for="name">Nome</label>
            <input
              id="name"
              v-model="client.name"
              type="text"
              :class="{ 'input-error': !isNameValid }"
              required
            />
            <p v-if="!isNameValid" class="error-message">Campo obrigatório</p>
          </div>

          <div class="column mx-xs">
            <label for="phone">Telefone</label>
            <input
              id="phone"
              v-model="client.phone"
              type="tel"
              :class="{ 'input-error': !isPhoneValid }"
              @input="formatPhone"
              required
            />
            <p v-if="!isPhoneValid" class="error-message">Campo obrigatório</p>
          </div>
        </div>

        <label for="endereco">Endereço</label>
        <input
          id="endereco"
          v-model="client.endereco"
          type="text"
          :class="{ 'input-error': !isEnderecoValid }"
          required
        />
        <p v-if="!isEnderecoValid" class="error-message">Campo obrigatório</p>
      </div>
    </template>

    <template #footer>
      <div class="row" style="justify-content: end">
        <button class="mx-xs button-outline" type="button" @click="handleClose">Cancelar</button>
        <button type="button" @click="saveClient" :disabled="!isFormValid">Salvar</button>
      </div>
    </template>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, PropType } from 'vue'
import api from '@/api'
import ModalComponent from '../../components/Modal.vue'
import ClienteEntity from '@/entity/ClienteEntity'

export default defineComponent({
  name: 'CadastroClientesView',
  components: {
    ModalComponent
  },
  props: {
    clienteId: {
      type: Number,
      required: false,
      default: null
    }
  },
  emits: ['close', 'client-saved'],
  setup(props, { emit }) {
    const client = ref<{ id: number | null; name: string; endereco: string; phone: string }>({
      id: null,
      name: '',
      endereco: '',
      phone: ''
    })

    onMounted(() => {
      if (props.clienteId) {
        handleOpen(props.clienteId)
      }
    })

    const isNameValid = computed(() => !!client.value.name)
    const isEnderecoValid = computed(() => !!client.value.endereco)
    const isPhoneValid = computed(() => !!client.value.phone)

    const isFormValid = computed(
      () => isNameValid.value && isEnderecoValid.value && isPhoneValid.value
    )

    const formatPhone = () => {
      const phone = client.value.phone.replace(/\D/g, '')
      if (phone.length > 10) {
        client.value.phone = `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`
      } else if (phone.length > 6) {
        client.value.phone = `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`
      } else if (phone.length > 2) {
        client.value.phone = `(${phone.slice(0, 2)}) ${phone.slice(2)}`
      } else {
        client.value.phone = phone
      }
    }

    const saveClient = async () => {
      if (!isFormValid.value) return

      const clienteEntity = new ClienteEntity({
        nome: client.value.name,
        telefone: client.value.phone,
        endereco: client.value.endereco
      })

      try {
        if (client.value.id) {
          await api.put(`/clientes/cliente-update-cliente/${client.value.id}`, clienteEntity)
        } else {
          await api.post('/clientes/cliente-create-cliente', clienteEntity)
        }
        emit('client-saved', clienteEntity)
        handleClose()
      } catch (error) {
        console.error('Erro ao salvar cliente:', error)
      }
    }

    const handleClose = () => {
      resetForm()
      emit('close')
    }

    const resetForm = () => {
      client.value = { id: null, name: '', endereco: '', phone: '' }
    }

    const handleOpen = async (clienteId: number) => {
      try {
        const response = await api.get(`/clientes/cliente-get-cliente-by-id/${clienteId}`)
        client.value = {
          id: response.data.id,
          name: response.data.nome,
          endereco: response.data.endereco,
          phone: response.data.telefone
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)
      }
    }

    return {
      client,
      saveClient,
      handleClose,
      resetForm,
      isFormValid,
      isNameValid,
      isEnderecoValid,
      isPhoneValid,
      formatPhone
    }
  }
})
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
}

input {
  margin-bottom: 10px;
}

.input-error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px; /* Ajuste para melhor visualização */
}
</style>
