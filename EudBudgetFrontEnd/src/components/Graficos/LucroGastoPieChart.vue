<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { ref, onMounted, watch, defineComponent, PropType } from 'vue'
import { Chart, registerables } from 'chart.js'
import ServicoEntity from '@/entity/ServicoEntity'
import GastoEntity from '@/entity/GastoEntity'
import theme from '@/theme'

Chart.register(...registerables)

export default defineComponent({
  name: 'LucroGastoPieChart',
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
    let chart: Chart | null = null

    const getChartColors = () => {
      const isDark = theme.isDarkTheme.value
      return {
        lucroColor: isDark ? '#588d35' : '#588d35',
        gastoColor: isDark ? '#e60000' : '#e60000',
        textColor: isDark ? '#ffffff' : '#000000' // Cor do texto
      }
    }

    const updateChart = () => {
      if (chart) {
        chart.destroy() // Destruir gráfico existente
      }

      const totalLucro = props.servicos.reduce((acc, servico) => acc + servico.valor, 0)
      const totalGasto = props.gastos.reduce((acc, gasto) => acc + gasto.valor, 0)

      const { lucroColor, gastoColor, textColor } = getChartColors()

      chart = new Chart(canvas.value!, {
        type: 'doughnut',
        data: {
          labels: ['Lucro', 'Gasto'],
          datasets: [
            {
              label: 'Proporção de Lucro e Gasto',
              data: [totalLucro, totalGasto],
              backgroundColor: [lucroColor, gastoColor],
              hoverOffset: 4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: textColor // Cor do texto da legenda
              }
            },
            title: {
              display: true,
              text: 'Proporção de Lucro e Gasto',
              color: textColor,
              font: {
                size: 20
              }
            }
          }
        }
      })
    }

    onMounted(() => {
      updateChart()
    })

    watch(
      [
        () => props.servicos,
        () => props.gastos,
        () => props.selectedFilter,
        () => theme.isDarkTheme.value
      ],
      updateChart
    )

    return {
      canvas
    }
  }
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: auto !important;
}
</style>
