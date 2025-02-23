<template>
    <div class="card">
        <LineChart class="chart" v-if="asientosData"  :chartdata="asientosData" :options="asientosOptions"></LineChart>
    </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import LineChart from './LineChart'
import moment from 'moment'

export default {
    name: 'seats-chart',
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
        
        const asientos = ref({})
        const viajes = ref({})
        const asientosData = ref({})
        const asientosOptions = ref({
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Asientos'
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
                    },
                    stacked: true
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cantidad'
                    },
                    stacked: true
                }]
            }
        })

        const processTrips = (viajes, asientos, minDate, maxDate) => {
            let etiquetas = []
            let datos = []
            let ocupados = []
            let desocupados = []
            if (viajes) {
                let arr = viajes.sort((a, b) => {
                    if (a.key < b.key) return -1
                    if (a.key > b.key) return 1
                    return 0
                })
                for (let index = 0; index < arr.length; index++) {
                    let element = viajes[index]
                    if (element.key <= maxDate && element.key >= minDate) {
                        for (let i = 0; i < asientos.length; i++) {
                            let solicitud = asientos[i]
                            if (solicitud.key === element.key && solicitud.state === 1) {
                                ocupados.push(solicitud.cantidad)
                                desocupados.push(parseFloat(element.asientos_ofrecidos_total) - solicitud.cantidad)
                                break
                            }
                        }
                        etiquetas.push(element.key)
                        datos.push(element.cantidad)
                    }
                }
                return {
                    labels: etiquetas,
                    datasets: [{
                        label: 'Ocupados',
                        borderColor: 'blue',
                        data: ocupados,
                        backgroundColor: 'rgb(0, 0, 255, 0.5)',
                        fill: true
                    }, {
                        label: 'No ocupados',
                        backgroundColor: 'rgb(255, 0, 0, 0.5)',
                        borderColor: '#F00',
                        data: desocupados,
                        fill: true
                    }]
                }
            }
        }

        const loadData = async () => {
            viajes.value = await store.dispatch('admin/getTrips')
            asientos.value = await store.dispatch('admin/getSeats')
            viajes.value = viajes.value.trips
            asientosData.value = processTrips(viajes.value, asientos.value, props.minDate, props.maxDate)
        }

        watch(() => props.minDate, () => {
            asientosData.value = processTrips(viajes.value, asientos.value, props.minDate, props.maxDate)
        })

        watch(() => props.maxDate, () => {
            asientosData.value = processTrips(viajes.value, asientos.value, props.minDate, props.maxDate)
        })

        onMounted(() => {
            loadData()
        })

        return {
            asientos,
            viajes,
            asientosData,
            asientosOptions,
            processTrips,
            loadData
        }
    }
}
</script>

<style scoped>
.card {
    background-color: #fff;
    border-radius: 2px;
    height: 45vh;
}
.chart {
    height: 45vh;
}
</style>
