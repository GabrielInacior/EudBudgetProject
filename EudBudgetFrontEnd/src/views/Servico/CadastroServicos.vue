<template>
  <ModalComponent @close="handleClose" size="large">
    <template #header>
      <h3>{{ servicoId ? 'Editar Serviço' : 'Cadastrar Serviço' }}</h3>
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
            <label for="valor">Valor (R$)</label>
            <input
              id="valor"
              v-model="valorFormatado"
              type="text"
              @input="formatarValor"
              :class="{ 'input-error': !isValorValid }"
              placeholder="R$ 0,00"
              required
            />
            <p v-if="!isValorValid" class="error-message">Campo obrigatório</p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="row" style="justify-content: end">
        <button class="mx-xs button-outline" type="button" @click="handleClose">Cancelar</button>
        <button type="button" @click="saveServico" :disabled="!isFormValid">Salvar</button>
      </div>
    </template>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
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
    },
    servicoId: {
      type: Number || null,
      required: false,
      default: null
    }
  },
  emits: ['close', 'servico-saved'],
  setup(props, { emit }) {
    const servico = ref({ nome: '', data: '', valor: 0 })
    const valorFormatado = ref('')

    const isNomeValid = computed(() => !!servico.value.nome)
    const isDataValid = computed(() => !!servico.value.data)
    const isValorValid = computed(() => servico.value.valor > 0)

    const isFormValid = computed(() => isNomeValid.value && isDataValid.value && isValorValid.value)

    const formatarValor = () => {
      const valorString = valorFormatado.value.replace(/\D/g, '')
      const length = valorString.length

      if (length === 0) {
        valorFormatado.value = ''
        servico.value.valor = 0
      } else {
        const reais = valorString.slice(0, -2) || '0'
        const centavos = valorString.slice(-2).padStart(2, '0')
        valorFormatado.value = `${reais},${centavos}`.replace(/^0+(?=\d)/, '') || '0'
        servico.value.valor = parseFloat(valorString) / 100 || 0
      }
    }

    const saveServico = async () => {
      if (!isFormValid.value) return

      try {
        const servicoEntity = new ServicoEntity({
          nome: servico.value.nome,
          data: new Date(servico.value.data).toISOString(),
          valor: servico.value.valor,
          clienteId: props.clienteId
        })

        if (props.servicoId) {
          await api.put(`/servicos/servico-update-servico/${props.servicoId}`, servicoEntity)
        } else {
          await api.post('/servicos/servico-create-servico', servicoEntity)
        }

        emit('servico-saved', servicoEntity)
        resetForm()
        emit('close')
      } catch (error) {
        console.error('Erro ao salvar serviço:', error)
      }
    }

    const fetchServico = async () => {
      if (!props.servicoId) return

      try {
        const response = await api.get(`/servicos/servico-get-servico-by-id/${props.servicoId}`)
        const { nome, data, valor } = response.data
        servico.value = { nome, data: data.slice(0, 10), valor }
        valorFormatado.value = valor
          .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          .replace('R$', '')
          .trim()
      } catch (error) {
        console.error('Erro ao buscar serviço:', error)
      }
    }

    const handleClose = () => {
      resetForm()
      emit('close')
    }

    const resetForm = () => {
      servico.value = { nome: '', data: '', valor: 0 }
      valorFormatado.value = ''
    }

    onMounted(() => {
      if (props.servicoId) {
        fetchServico()
      }
    })

    return {
      servico,
      valorFormatado,
      saveServico,
      handleClose,
      resetForm,
      isFormValid,
      isNomeValid,
      isDataValid,
      isValorValid,
      formatarValor
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
