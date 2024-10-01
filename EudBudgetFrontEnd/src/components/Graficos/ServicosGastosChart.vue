<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import GastoEntity from '@/entity/GastoEntity'
import ServicoEntity from '@/entity/ServicoEntity'
import theme from '@/theme' // Importe seu tema

Chart.register(...registerables)

export default defineComponent({
  name: 'DonutChart',
  props: {
    servicos: {
      type: Array as PropType<ServicoEntity[]>,
      required: true
    },
    gastos: {
      type: Array as PropType<GastoEntity[]>,
      required: true
    },
    selectedFilter: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null)
    let chart: Chart | null = null // Adicione uma variável para o gráfico

    const getChartColors = () => {
      const isDark = theme.isDarkTheme.value
      return {
        backgroundColor: isDark ? 'rgba(88, 141, 53, 0.5)' : 'rgba(88, 141, 53, 0.3)', // Cor do lucro
        borderColor: isDark ? '#588d35' : '#588d35', // Cor do lucro
        backgroundColorGasto: isDark ? 'rgba(230, 0, 0, 0.5)' : 'rgba(230, 0, 0, 0.3)', // Cor do gasto
        borderColorGasto: isDark ? '#e60000' : '#e60000', // Cor do gasto
        textColor: isDark ? '#ffffff' : '#000000' // Cor do texto
      }
    }

    const renderChart = () => {
      const { backgroundColor, borderColor, backgroundColorGasto, borderColorGasto, textColor } =
        getChartColors()

      const data = {
        labels: ['Serviços', 'Gastos', 'Lucro'],
        datasets: [
          {
            label: 'Valores',
            data: [
              props.servicos.length,
              props.gastos.length,
              props.servicos.length - props.gastos.length
            ],
            backgroundColor: [
              backgroundColor, // Cor do lucro
              backgroundColorGasto, // Cor do gasto
              'rgba(255, 215, 0, 0.5)' // Cor para o lucro
            ],
            borderWidth: 1
          }
        ]
      }

      if (canvas.value) {
        if (chart) {
          chart.destroy() // Destruir gráfico existente antes de criar um novo
        }

        chart = new Chart(canvas.value, {
          type: 'doughnut', // Altera o tipo para doughnut
          data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: textColor
                }
              },
              title: {
                display: true,
                text: 'Serviços e Gastos',
                color: textColor,
                font: {
                  size: 25
                }
              }
            }
          }
        })
      }
    }

    onMounted(() => {
      renderChart()
    })

    // Re-render the chart when data or theme changes
    watch(() => [props.servicos, props.gastos, theme.isDarkTheme.value], renderChart)

    return {
      canvas
    }
  }
})
</script>

<style scoped>
canvas {
  width: 100% !important; /* Mantém a largura em 100% */
  height: auto !important; /* Permite que a altura seja ajustada automaticamente */
}
</style>
