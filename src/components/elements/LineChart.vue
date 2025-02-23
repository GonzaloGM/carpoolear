<script>
import { watch, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
    name: 'linechart',
    extends: Line,
    props: ['chartdata', 'options'],
    setup(props) {
        const chartInfo = computed(() => props.chartdata)

        watch(chartInfo, () => {
            renderChart()
        })

        const renderChart = () => {
            this.renderChart(chartInfo.value, props.options)
        }

        return { chartInfo }
    },
    mounted() {
        this.renderChart(this.chartInfo, this.options)
    }
}
</script>

<style>
</style>