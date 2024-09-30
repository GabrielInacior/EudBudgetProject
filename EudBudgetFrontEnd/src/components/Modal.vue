<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div :class="modalSizeClass" class="modal-container">
      <button class="modal-close" @click="closeModal" aria-label="Fechar modal">X</button>

      <div class="modal-header">
        <slot name="header">
          <h3>Modal Header</h3>
        </slot>
      </div>

      <div class="modal-content">
        <slot></slot>
      </div>

      <div class="modal-footer">
        <slot name="footer">
          <button @click="closeModal">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'ModalComponent',
  props: {
    size: {
      type: String,
      default: 'medium'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const modalSizeClass = computed(() => {
      return {
        'modal-small': props.size === 'small',
        'modal-medium': props.size === 'medium',
        'modal-large': props.size === 'large'
      }
    })

    const closeModal = () => {
      emit('close') // Emitir o evento de fechamento
    }

    return {
      modalSizeClass,
      closeModal
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.modal-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.modal-footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
  margin-top: 16px;
  text-align: right;
}

.modal-small {
  width: 300px;
}

.modal-medium {
  width: 500px;
}

.modal-large {
  width: 800px;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #1a1b41; /* Cor do texto */
  padding: 5px; /* Espaçamento em torno do botão */
}

.modal-close:hover {
  color: #c2e7da; /* Cor ao passar o mouse */
}
</style>
