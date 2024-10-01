<template>
  <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { ref, onMounted, watch, defineComponent, PropType } from 'vue'
import { Chart, registerables } from 'chart.js'
import ServicoEntity from '@/entity/ServicoEntity' // Importe sua entidade
import GastoEntity from '@/entity/GastoEntity' // Importe sua entidade
import theme from '@/theme'

Chart.register(...registerables)

export default defineComponent({
  name: 'EvolucaoLucroChart',
  props: {
    servicos: {
      type: Array as PropType<ServicoEntity[]>, // Especifica o tipo
      required: true
    },
    gastos: {
      type: Array as PropType<GastoEntity[]>, // Especifica o tipo
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
        borderColor: '#588d35',
        backgroundColor: 'rgba(88, 141, 53, 0.2)',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#ccc',
        axisColor: isDark ? '#ffffff' : '#000000',
        textColor: isDark ? '#ffffff' : '#000000' // Cor do texto
      }
    }

    const updateChart = () => {
      if (chart) {
        chart.destroy() // Destruir gráfico existente
      }

      const labels = props.servicos.map((servico) => {
        const date = new Date(servico.data)
        return props.selectedFilter === 'lastMonth'
          ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
          : date.toLocaleDateString('pt-BR', { month: 'long' })
      })

      const lucroData = props.servicos.map((servico) => servico.valor)
      const gastoData = props.gastos.map((gasto) => gasto.valor)

      const totalLucroData = lucroData.map((lucro, index) => lucro - (gastoData[index] || 0))

      const { borderColor, backgroundColor, gridColor, axisColor, textColor } = getChartColors()

      chart = new Chart(canvas.value!, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Lucro Evolução',
              data: totalLucroData,
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
              text: 'Evolução do Lucro',
              color: textColor,
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
  width: 100% !important;
  height: auto !important;
}
</style>
