<template>
  <ModalComponent @close="handleClose" size="large">
    <template #header>
      <h3>Cadastrar Serviço</h3>
    </template>

    <template #default>
      <div class="column">
        <div class="row">
          <div class="column mx-xs">
            <label for="name">Nome do Serviço</label>
            <input
              id="name"
              v-model="servico.nome"
              type="text"
              :class="{ 'input-error': !isNomeValid }"
              required
            />
            <p v-if="!isNomeValid" class="error-message">Campo obrigatório</p>
          </div>

          <div class="column mx-xs">
            <label for="data">Data do Serviço</label>
            <input
              id="data"
              v-model="servico.data"
              type="date"
              :class="{ 'input-error': !isDataValid }"
              required
            />
            <p v-if="!isDataValid" class="error-message">Campo obrigatório</p>
          </div>
        </div>

        <div class="row">
          <div class="column mx-xs">
            <label for="valor">Valor</label>
            <input
              id="valor"
              v-model="servico.valor"
              type="number"
              :class="{ 'input-error': !isValorValid }"
              required
            />
            <p v-if="!isValorValid" class="error-message">Campo obrigatório</p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <button class="mx-xs button-outline" type="button" @click="handleClose">Cancelar</button>
      <button type="button" @click="saveServico" :disabled="!isFormValid">Salvar</button>
    </template>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import api from '@/api'
import ModalComponent from '../../components/Modal.vue'
import ServicoEntity from '@/entity/ServicoEntity'

export default defineComponent({
  name: 'CadastroServicos',
  components: {
    ModalComponent
  },
  props: {
    clienteId: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'servico-saved'],
  setup(props, { emit }) {
    const servico = ref({ nome: '', data: '', valor: 0 })

    const isNomeValid = computed(() => !!servico.value.nome)
    const isDataValid = computed(() => !!servico.value.data)
    const isValorValid = computed(() => servico.value.valor > 0)

    const isFormValid = computed(() => isNomeValid.value && isDataValid.value && isValorValid.value)

    const saveServico = async () => {
      if (!isFormValid.value) return

      try {
        const servicoEntity = new ServicoEntity({
          nome: servico.value.nome,
          data: new Date(servico.value.data).toISOString(), // Converte a data para o formato ISO
          valor: servico.value.valor,
          clienteId: props.clienteId
        })

        console.log(servicoEntity)
        await api.post('/servicos/servico-create-servico', servicoEntity)
        emit('servico-saved', servicoEntity)
        resetForm()
        emit('close')
      } catch (error) {
        console.error('Erro ao salvar serviço:', error)
      }
    }

    const handleClose = () => {
      resetForm()
      emit('close')
    }

    const resetForm = () => {
      servico.value = { nome: '', data: '', valor: 0 }
    }

    return {
      servico,
      saveServico,
      handleClose,
      resetForm,
      isFormValid,
      isNomeValid,
      isDataValid,
      isValorValid
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
  margin-top: 4px;
}
</style>
