<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { ref, onMounted, watch, defineComponent, PropType } from 'vue'
import { Chart, registerables } from 'chart.js'
import GastoEntity from '@/entity/GastoEntity'
import theme from '@/theme'

Chart.register(...registerables)

export default defineComponent({
  name: 'EvolucaoGastosChart',
  props: {
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
        borderColor: '#e60000',
        backgroundColor: 'rgba(230, 0, 0, 0.2)',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#ccc',
        axisColor: isDark ? '#ffffff' : '#000000',
        textColor: isDark ? '#ffffff' : '#000000' // Cor do texto
      }
    }

    const updateChart = () => {
      if (chart) {
        chart.destroy()
      }

      const labels = props.gastos.map((gasto) => {
        const date = new Date(gasto.data)
        return props.selectedFilter === 'lastMonth'
          ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
          : date.toLocaleDateString('pt-BR', { month: 'long' })
      })

      const gastosData = props.gastos.map((gasto) => gasto.valor)

      const { borderColor, backgroundColor, gridColor, axisColor, textColor } = getChartColors()

      chart = new Chart(canvas.value!, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Evolução de Gastos',
              data: gastosData,
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              fill: true
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
              color: textColor,
              text: 'Evolução dos gastos',
              font: {
                size: 20
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Data',
                color: axisColor // Cor do título do eixo X
              },
              grid: {
                color: gridColor // Cor da grade do eixo X
              },
              ticks: {
                color: textColor // Cor do texto dos ticks do eixo X
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Valor',
                color: axisColor // Cor do título do eixo Y
              },
              grid: {
                color: gridColor // Cor da grade do eixo Y
              },
              ticks: {
                color: textColor // Cor do texto dos ticks do eixo Y
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
      [() => props.gastos, () => props.selectedFilter, () => theme.isDarkTheme.value],
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
  width: 100% !important;
  height: auto !important;
}
</style>
