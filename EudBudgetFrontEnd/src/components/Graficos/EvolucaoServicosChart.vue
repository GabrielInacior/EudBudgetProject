<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { ref, onMounted, watch, defineComponent, PropType } from 'vue'
import { Chart, registerables } from 'chart.js'
import ServicoEntity from '@/entity/ServicoEntity' // Importe sua entidade
import theme from '@/theme'

Chart.register(...registerables)

export default defineComponent({
  name: 'EvolucaoServicosChart',
  props: {
    servicos: {
      type: Array as PropType<ServicoEntity[]>, // Especifica o tipo
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
        borderColor: '#3e95cd',
        backgroundColor: 'rgba(62, 149, 205, 0.2)',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#ccc',
        axisColor: isDark ? '#ffffff' : '#000000',
        textColor: isDark ? '#ffffff' : '#000000' // Cor do texto
      }
    }

    const updateChart = () => {
      if (chart) {
        chart.destroy() // Destruir gráfico existente
      }

      const serviceCountByDate: Record<string, number> = {}
      props.servicos.forEach((servico) => {
        const date = new Date(servico.data)
        const dateKey =
          props.selectedFilter === 'lastMonth'
            ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            : date.toLocaleDateString('pt-BR', { month: 'long' })

        serviceCountByDate[dateKey] = (serviceCountByDate[dateKey] || 0) + 1
      })

      const labels = Object.keys(serviceCountByDate)
      const quantidadeServicosData = Object.values(serviceCountByDate)

      const { borderColor, backgroundColor, gridColor, axisColor, textColor } = getChartColors()

      chart = new Chart(canvas.value!, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Evolução de Serviços',
              data: quantidadeServicosData,
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
              text: 'Evolução da quantidade de serviços',
              font: {
                size: 25
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
                text: 'Quantidade',
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
      [() => props.servicos, () => props.selectedFilter, () => theme.isDarkTheme.value],
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
