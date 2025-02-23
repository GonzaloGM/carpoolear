<template>
    <div class="card column">
        <LineChart class="chart" :chartdata="viajesData" :options="viajesOptions"></LineChart>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import LineChart from './LineChart'
import moment from 'moment'

export default {
    name: 'trips-chart',
    components: {
        LineChart
    },
    props: {
        minDate: {
            default: moment(Date(new Date().getFullYear(), 0, 1), 'YYYY-MM')
        },
        maxDate: {
            default: moment(Date(), 'YYYY-MM')
        }
    },
    setup(props) {
        const store = useStore()
        const viajes = ref({})
        const viajesData = ref({})
        const viajesOptions = ref({
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Viajes de conductores en la plataforma'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Mes'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cantidad'
                    }
                }]
            }
        })

        const processTrips = (viajes, minDate, maxDate) => {
            let etiquetas = []
            let datos = []
            if (viajes) {
                let arr = viajes.sort((a, b) => {
                    if (a.key < b.key) return -1
                    if (a.key > b.key) return 1
                    return 0
                })
                for (let index = 0; index < arr.length; index++) {
                    let element = viajes[index]
                    if (element.key <= maxDate && element.key >= minDate) {
                        etiquetas.push(element.key)
                        datos.push(element.cantidad)
                    }
                }
                return {
                    labels: etiquetas,
                    datasets: [{
                        label: 'Cantidad de viajes',
                        backgroundColor: '#F00',
                        borderColor: '#F00',
                        data: datos,
                        fill: false
                    }]
                }
            }
        }

        const loadData = async () => {
            let viajesResult = await store.dispatch('admin/getTrips')
            viajes.value = viajesResult.trips
            viajesData.value = processTrips(viajes.value, props.minDate, props.maxDate)
        }

        watch(() => props.minDate, () => {
            viajesData.value = processTrips(viajes.value, props.minDate, props.maxDate)
        })

        watch(() => props.maxDate, () => {
            viajesData.value = processTrips(viajes.value, props.minDate, props.maxDate)
        })

        onMounted(() => {
            loadData()
        })

        return {
            viajes,
            viajesData,
            viajesOptions
        }
    }
}
</script>

<style scoped>
.card {
    background-color: #fff;
    border-radius: 2px;
}
.chart {
    height: 45vh;
}
</style>
