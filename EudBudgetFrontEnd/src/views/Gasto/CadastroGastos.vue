<template>
  <Modal @close="handleClose" size="large">
    <template #header>
      <h3>{{ gasto.id ? 'Editar Gasto' : 'Cadastrar Gasto' }}</h3>
    </template>

    <template #default>
      <div class="column">
        <div class="row">
          <div class="column mx-xs">
            <label for="nome">Gasto</label>
            <input
              id="nome"
              v-model="gasto.nome"
              type="text"
              :class="{ 'input-error': !isNomeValid }"
              required
            />
            <p v-if="!isNomeValid" class="error-message">Campo obrigatório</p>
          </div>

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

        <div class="row">
          <div class="column mx-xs">
            <label for="data">Data</label>
            <input
              id="data"
              v-model="gasto.data"
              type="date"
              :class="{ 'input-error': !isDataValid }"
              required
            />
            <p v-if="!isDataValid" class="error-message">Campo obrigatório</p>
          </div>
        </div>

        <label for="descricao">Descrição</label>
        <textarea
          id="descricao"
          v-model="gasto.descricao"
          rows="4"
          :class="{ 'input-error': !gasto.descricao }"
        ></textarea>
        <p v-if="!gasto.descricao" class="error-message">Campo obrigatório</p>
      </div>
    </template>

    <template #footer>
      <div class="row" style="justify-content: end">
        <button class="mx-xs button-gasto-outline" type="button" @click="handleClose">
          Cancelar
        </button>
        <button class="button-gasto" type="button" @click="saveGasto" :disabled="!isFormValid">
          Salvar
        </button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import api from '@/api'
import GastoEntity from '@/entity/GastoEntity'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  name: 'CadastroGastos',
  components: { Modal },
  props: {
    gastoId: {
      type: Number,
      default: null
    }
  },
  emits: ['close', 'gasto-saved'],
  setup(props, { emit }) {
    const gasto = ref<GastoEntity>({
      id: props.gastoId || null,
      nome: '',
      valor: 0,
      descricao: '',
      data: '',
      totalGasto: 0
    })

    const valorFormatado = ref('')

    const isNomeValid = computed(() => !!gasto.value.nome)
    const isValorValid = computed(() => gasto.value.valor > 0)
    const isDataValid = computed(() => !!gasto.value.data)

    const isFormValid = computed(() => isNomeValid.value && isValorValid.value && isDataValid.value)

    const handleOpen = async (gastoId: number) => {
      try {
        const response = await api.get(`/gastos/gasto-get-gasto-by-id/${gastoId}`)
        gasto.value = response.data
        valorFormatado.value = gasto.value.valor
          .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          .replace('R$', '')
          .trim()
      } catch (error) {
        console.error('Erro ao buscar gasto:', error)
      }
    }

    onMounted(() => {
      if (props.gastoId) {
        handleOpen(props.gastoId)
      }
    })

    const formatarValor = () => {
      const valorString = valorFormatado.value.replace(/\D/g, '')
      const length = valorString.length

      if (length === 0) {
        valorFormatado.value = ''
        gasto.value.valor = 0
      } else {
        const reais = valorString.slice(0, -2) || '0'
        const centavos = valorString.slice(-2).padStart(2, '0')
        valorFormatado.value = `${reais},${centavos}`.replace(/^0+(?=\d)/, '') || '0'
        gasto.value.valor = parseFloat(valorString) / 100 || 0
      }
    }

    const saveGasto = async () => {
      if (!isFormValid.value) return

      try {
        const formattedData = new Date(gasto.value.data).toISOString()

        if (gasto.value.id) {
          await api.put(`/gastos/gasto-update-gasto/${gasto.value.id}`, {
            ...gasto.value,
            data: formattedData,
            valor: gasto.value.valor
          })
        } else {
          await api.post('/gastos/gasto-create-gasto', {
            ...gasto.value,
            data: formattedData,
            valor: Math.round(gasto.value.valor * 100)
          })
        }
        emit('gasto-saved', gasto.value)
        resetForm()
        handleClose()
      } catch (error) {
        console.error('Erro ao salvar gasto:', error)
      }
    }

    const resetForm = () => {
      gasto.value = { id: null, nome: '', valor: 0, descricao: '', data: '', totalGasto: 0 }
      valorFormatado.value = ''
    }

    const handleClose = () => {
      resetForm()
      emit('close')
    }

    return {
      gasto,
      valorFormatado,
      saveGasto,
      isNomeValid,
      isValorValid,
      isDataValid,
      isFormValid,
      handleClose,
      formatarValor
    }
  }
})
</script>

<style scoped>
.input-error {
  border: 2px solid red;
}

.error-message {
  color: red;
  font-size: 0.8rem;
}
</style>
